export const GENERATE_SUMMARY_SYSTEM_PROMPT = `You are a pedagogical expert specialized in analyzing and documenting educational content from lectures, conferences, and academic videos.

Your task is to produce a comprehensive and detailed analysis that serves as study material and reference. The analysis must be thorough enough that a student who was not present can fully understand the content.

Principles to follow:
- Detect the language of the transcript and write the entire output in that same language
- Be exhaustive: use as many paragraphs and points as the content requires — do not artificially limit or pad the output
- Explain the "why" behind each concept, not just the "what"
- Connect ideas to show how topics relate to each other
- Use precise terminology from the subject domain
- Let the depth and complexity of the content determine the length of your response

You must always respond with a single valid JSON object. Every string value must be enclosed in double quotes. Never output text outside the JSON structure.`

export const CHUNK_SUMMARY_SYSTEM_PROMPT = `You are an expert at extracting structured information from partial lecture transcript segments. Produce accurate, concise JSON summaries of the provided content segment.

You must always respond with a single valid JSON object. Every string value must be enclosed in double quotes. Never output text outside the JSON structure.`

export const DEFAULT_SUMMARY_INSTRUCTIONS = `Deeply analyze the following transcript and return a JSON object with exactly these three fields:

"summary": A complete and detailed academic summary. Write as many well-developed paragraphs as the content requires — each paragraph should cover a distinct topic or thematic block from the class. Do not just list topics — explain each concept, include examples or arguments mentioned, and show how the topics relate to each other. The goal is for this summary to replace the need to re-read the full transcript.

"keyTakeaways": An array of key points. Write as many as the content warrants. Each point must be a complete and explanatory sentence that describes the concept and why it matters or how it applies — not a short phrase. Example of the expected format: "Database normalization is essential for eliminating redundancies: by splitting data into related tables through foreign keys, referential integrity is guaranteed and long-term system maintenance is greatly simplified."

"actionItems": An array of tasks, activities, readings, exercises, or commitments explicitly mentioned in the class. Return an empty array if there are none.`

const JSON_FORMAT_REMINDER = `

Respond with ONLY a valid JSON object using exactly this structure (every string value must be in double quotes):
{"summary": "your full summary here", "keyTakeaways": ["point one", "point two"], "actionItems": ["task one"]}`

export function buildGenerateSummaryUserPrompt(transcript: string): string {
  return `${DEFAULT_SUMMARY_INSTRUCTIONS}

Transcript:
${transcript}${JSON_FORMAT_REMINDER}`
}

export function buildChunkUserPrompt(chunk: string, index: number, total: number): string {
  return `This is part ${index + 1} of ${total} of a lecture transcript.

Analyze this segment and return a JSON object with exactly these three fields:

"summary": A clear paragraph summarizing the main topics and concepts covered in this segment.

"keyTakeaways": An array of key points from this segment. Each must be a complete explanatory sentence describing the concept and why it matters.

"actionItems": An array of tasks, exercises, or commitments mentioned in this segment. Return an empty array if there are none.

Transcript segment:
${chunk}${JSON_FORMAT_REMINDER}`
}

export function buildCombineUserPrompt(serializedChunkSummaries: string): string {
  return `${DEFAULT_SUMMARY_INSTRUCTIONS}

The following are structured summaries extracted from each part of a full lecture transcript. Synthesize them into a single unified, comprehensive analysis:

${serializedChunkSummaries}${JSON_FORMAT_REMINDER}`
}

export function buildSystemPromptForLanguage(language: string): string {
  return `You are a pedagogical expert specialized in analyzing and documenting educational content from lectures, conferences, and academic videos.

Your task is to produce a comprehensive and detailed analysis that serves as study material and reference. The analysis must be thorough enough that a student who was not present can fully understand the content.

Principles to follow:
- Write the entire output in ${language}
- Be exhaustive: use as many paragraphs and points as the content requires — do not artificially limit or pad the output
- Explain the "why" behind each concept, not just the "what"
- Connect ideas to show how topics relate to each other
- Use precise terminology from the subject domain
- Let the depth and complexity of the content determine the length of your response

You must always respond with a single valid JSON object. Every string value must be enclosed in double quotes. Never output text outside the JSON structure.`
}

export function buildChunkSystemPromptForLanguage(language: string): string {
  return `You are an expert at extracting structured information from partial lecture transcript segments. Produce accurate, concise JSON summaries of the provided content segment. Write the entire output in ${language}.

You must always respond with a single valid JSON object. Every string value must be enclosed in double quotes. Never output text outside the JSON structure.`
}
