"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { startSession } from "../api/forensicClient"
import { useForensicSession } from "../system/ForensicSession"

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "image/jpeg",
  "image/png"
]

const MAX_MB = 50

export default function MediaIntake() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { startSession: setSession } =
    useForensicSession()

  const [fileName, setFileName] =
    useState<string | null>(null)
  const [error, setError] =
    useState<string | null>(null)
  const [loading, setLoading] =
    useState(false)

  const handleFile = async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported file type")
      return
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_MB) {
      setError("File exceeds 50MB limit")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setFileName(file.name)

      const { sessionId } =
        await startSession(file)

      setSession(sessionId)
    } catch {
      setError("Failed to start forensic session")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="media-intake"
      className="bg-black text-white flex flex-col items-center justify-center px-10 py-32"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Media Verification Console
      </motion.h2>

      <div className="w-full max-w-4xl border border-gray-700 rounded-xl bg-[#050505] p-8">
        <div
          onClick={() =>
            !loading && inputRef.current?.click()
          }
          className="border border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition"
        >
          <p className="text-gray-300">
            {loading
              ? "UPLOADING..."
              : "DROP MEDIA FILE OR CLICK TO UPLOAD"}
          </p>

          {fileName && (
            <p className="text-xs text-indigo-400 mt-3">
              LOADED: {fileName}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 text-xs text-red-400">
            {error}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </section>
  )
}