import { pipeline, env } from '@huggingface/transformers'

env.allowLocalModels = false

type ProgressCallback = {
  status: string
  name?: string
  file?: string
  loaded?: number
  total?: number
  progress?: number
}

type WorkerMessage = { type: 'transcribe'; audio: Float32Array; language?: string }

type Chunk = { text: string; timestamp: [number, number | null] }

type TranscriberOutput = {
  text: string
  chunks?: Chunk[]
}

type WorkerResult =
  | { type: 'progress'; status: string; loaded: number; total: number }
  | { type: 'result'; text: string; segments: string }
  | { type: 'error'; message: string }

type GPUType = { requestAdapter: () => Promise<unknown> }

async function resolveDevice(): Promise<'webgpu' | 'wasm'> {
  if (typeof navigator === 'undefined' || !('gpu' in navigator)) return 'wasm'
  try {
    const adapter = await (navigator as unknown as { gpu: GPUType }).gpu.requestAdapter()
    return adapter !== null ? 'webgpu' : 'wasm'
  } catch {
    return 'wasm'
  }
}

let pipe: Awaited<ReturnType<typeof pipeline>> | null = null
let loadedDevice: 'webgpu' | 'wasm' | null = null

function collapseRepetitions(text: string): string {
  const tokens = text.split(/\s+/)
  const deduped: string[] = []

  for (const token of tokens) {
    const core = token.replace(/^[¿¡]+|[.!?,;:]+$/g, '').toLowerCase()
    if (!core) {
      deduped.push(token)
      continue
    }

    let run = 0
    for (let i = deduped.length - 1; i >= 0; i--) {
      if (deduped[i].replace(/^[¿¡]+|[.!?,;:]+$/g, '').toLowerCase() === core) run++
      else break
    }

    if (run < 2) deduped.push(token)
  }

  const joined = deduped.join(' ')
  const rawSentences = joined.match(/[^.!?]+[.!?]*/g) ?? [joined]
  const uniqueSentences: string[] = []

  for (const sentence of rawSentences) {
    const norm = sentence.trim().toLowerCase()
    if (!norm) continue
    if (norm !== uniqueSentences[uniqueSentences.length - 1]?.trim().toLowerCase()) {
      uniqueSentences.push(sentence)
    }
  }

  return uniqueSentences.join(' ').trim()
}

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  if (e.data.type !== 'transcribe') return

  try {
    if (!pipe) {
      const device = await resolveDevice()
      const buildPipeline = (d: 'webgpu' | 'wasm') => {
        const model = d === 'webgpu' ? 'onnx-community/whisper-small' : 'onnx-community/whisper-base'
        return pipeline('automatic-speech-recognition', model, {
          device: d,
          dtype: d === 'webgpu'
            ? 'fp32'
            : { encoder_model: 'q8', decoder_model_merged: 'fp32' },
          progress_callback: (p: ProgressCallback) => {
            self.postMessage({
              type: 'progress',
              status: p.status,
              loaded: p.loaded ?? 0,
              total: p.total ?? 0,
            } satisfies WorkerResult)
          },
        })
      }

      try {
        pipe = await buildPipeline(device)
        loadedDevice = device
      } catch (err) {
        if (device === 'webgpu') {
          pipe = await buildPipeline('wasm')
          loadedDevice = 'wasm'
        } else {
          throw err
        }
      }

      const model = loadedDevice === 'webgpu' ? 'onnx-community/whisper-small' : 'onnx-community/whisper-base'
      console.log(`[whisper-worker] model: ${model} | device: ${loadedDevice}`)
    }

    const transcriber = pipe as unknown as (
      input: Float32Array,
      options?: {
        language?: string
        task?: string
        chunk_length_s?: number
        stride_length_s?: number
        return_timestamps?: boolean
        no_repeat_ngram_size?: number
        condition_on_previous_text?: boolean
      }
    ) => Promise<TranscriberOutput>

    const output = await transcriber(e.data.audio, {
      language: e.data.language ?? 'spanish',
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true,
      no_repeat_ngram_size: 3,
      condition_on_previous_text: false,
    })

    const cleanText = collapseRepetitions(output.text)

    const segments = (output.chunks ?? []).map((chunk) => ({
      start: chunk.timestamp[0],
      end: chunk.timestamp[1] ?? chunk.timestamp[0],
      text: collapseRepetitions(chunk.text),
    }))

    self.postMessage({
      type: 'result',
      text: cleanText,
      segments: JSON.stringify(segments),
    } satisfies WorkerResult)
  } catch (err) {
    console.error('[whisper-worker]', err instanceof Error ? err : new Error(String(err)))
    self.postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : 'Transcription failed',
    } satisfies WorkerResult)
  }
}
