import { useState, useCallback } from 'react'

interface CloudinaryUploadResult {
  publicId: string
  url: string
  duration: number
}

interface CloudinaryApiResponse {
  public_id: string
  secure_url: string
  duration: number
}

interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<CloudinaryUploadResult>
  isUploading: boolean
  uploadProgress: number
}

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const upload = useCallback((file: File): Promise<CloudinaryUploadResult> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

    if (!cloudName || !uploadPreset) {
      return Promise.reject(
        new Error('Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET env vars'),
      )
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100))
        }
      }

      xhr.onload = () => {
        setIsUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText) as CloudinaryApiResponse
          resolve({
            publicId: response.public_id,
            url: response.secure_url,
            duration: response.duration,
          })
        } else {
          const body = xhr.responseText
          let message = xhr.statusText
          try {
            const parsed = JSON.parse(body) as { error?: { message?: string } }
            if (parsed.error?.message) message = parsed.error.message
          } catch {
            // keep statusText
          }
          reject(new Error(`Cloudinary upload failed: ${message}`))
        }
      }

      xhr.onerror = () => {
        setIsUploading(false)
        reject(new Error('Upload failed due to a network error'))
      }

      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`)
      setIsUploading(true)
      setUploadProgress(0)
      xhr.send(formData)
    })
  }, [])

  return { upload, isUploading, uploadProgress }
}
