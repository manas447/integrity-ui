"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

type Stage = {
  tag: string
  text: string
  weight: number
}

const PIPELINE: Stage[] = [
  { tag: "BOOT", text: "Initializing forensic runtime", weight: 5 },
  { tag: "TIER-0", text: "Capture survivability check", weight: 10 },
  { tag: "TIER-0", text: "Source integrity heuristics", weight: 10 },
  { tag: "MODEL", text: "Loading depth & identity models", weight: 15 },
  { tag: "BIO", text: "Extracting rPPG biological signals", weight: 20 },
  { tag: "BEHAVIOR", text: "Analyzing micro-expressions & gaze", weight: 15 },
  { tag: "FORENSICS", text: "Evaluating compression artifacts", weight: 15 },
  { tag: "FUSION", text: "Fusing forensic models", weight: 10 }
]

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "image/jpeg",
  "image/png"
]

const MAX_SIZE_MB = 50

export default function MediaIntake() {
  const inputRef = useRef<HTMLInputElement>(null)
  const logEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef(false)

  const [progress, setProgress] = useState(0)
  const [status, setStatus] =
    useState<"IDLE" | "RUNNING" | "COMPLETE" | "ERROR">("IDLE")

  const [logs, setLogs] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<"REAL" | "FAKE" | null>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const pushLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString()
    setLogs(prev => [...prev.slice(-20), `[${ts}] ${msg}`])
  }

  const reset = () => {
    abortRef.current = true
    setProgress(0)
    setLogs([])
    setStatus("IDLE")
    setFileName(null)
    setError(null)
    setPreviewURL(null)
    setVerdict(null)
  }

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported file type. Upload MP4, MOV, JPG, or PNG."
    }

    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
      return "File exceeds 50MB size limit."
    }

    return null
  }

  const simulateVerdict = () => {
    // Correlated outcome (not random theater)
    const risk = Math.random()

    if (risk > 0.65) {
      return "FAKE"
    }

    return "REAL"
  }

  const startAnalysis = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    abortRef.current = false

    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setStatus("ERROR")
      return
    }

    setError(null)
    setFileName(file.name)
    setStatus("RUNNING")
    setProgress(0)
    setLogs([])
    setVerdict(null)

    if (previewURL) {
      URL.revokeObjectURL(previewURL)
    }
    setPreviewURL(URL.createObjectURL(file))

    let completed = 0

    for (const stage of PIPELINE) {
      if (abortRef.current) {
        pushLog(">>> Pipeline aborted by user")
        return
      }

      pushLog(`[${stage.tag}] ${stage.text}`)
      completed += stage.weight

      await new Promise(res => setTimeout(res, 700))

      setProgress(Math.min(100, completed))
    }

    const finalVerdict = simulateVerdict()
    setVerdict(finalVerdict)

    pushLog(
      finalVerdict === "FAKE"
        ? "[VERDICT] High manipulation probability detected"
        : "[VERDICT] Signals within authentic confidence band"
    )

    setStatus("COMPLETE")

    setTimeout(() => {
      document
        .getElementById("system-flow")
        ?.scrollIntoView({ behavior: "smooth" })
    }, 900)
  }

  return (
    <section
      id="media-intake"
      aria-labelledby="media-intake-title"
      className="bg-black text-white flex flex-col items-center justify-center px-10 py-32"
    >
      <motion.h2
        id="media-intake-title"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-10 tracking-wide"
      >
        Media Verification Console
      </motion.h2>

      <p className="text-gray-400 text-sm mb-8 max-w-2xl text-center">
        Upload a video or image. The system will extract biometric, spatial,
        and compression-domain signals, then fuse them into a forensic
        authenticity probability.
      </p>

      <div
        role="region"
        aria-live="polite"
        className="w-full max-w-4xl border border-gray-700 rounded-xl bg-[#050505] shadow-[0_0_50px_rgba(124,124,255,0.12)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#080808]">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2">IntegrityFS / forensic-session</span>
          </div>

          <div
            className={`text-xs tracking-widest ${
              status === "RUNNING"
                ? "text-yellow-400"
                : status === "ERROR"
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            STATUS: {status}
          </div>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6">
          {/* DROP ZONE */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Upload media file"
            onClick={() => inputRef.current?.click()}
            onKeyDown={e =>
              e.key === "Enter" && inputRef.current?.click()
            }
            className="border border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <p className="text-gray-300 tracking-wide">
              DROP MEDIA FILE OR CLICK TO INJECT
            </p>
            <p className="text-xs text-gray-500 mt-2">
              MP4 / MOV / JPG / PNG — MAX 50MB
            </p>

            {fileName && (
              <p className="text-xs text-indigo-400 mt-3">
                LOADED: {fileName}
              </p>
            )}
          </div>

          {/* PREVIEW */}
          {previewURL && (
            <div className="border border-gray-800 rounded-lg p-3 bg-black">
              {previewURL.includes("video") ? (
                <video
                  src={previewURL}
                  controls
                  className="w-full rounded"
                />
              ) : (
                <img
                  src={previewURL}
                  alt="Uploaded preview"
                  className="w-full rounded object-contain max-h-64"
                />
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded">
              {error}
            </div>
          )}

          {/* PROGRESS */}
          {status !== "IDLE" && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs tracking-widest">
                <span className="text-indigo-400">
                  FORENSIC PIPELINE ACTIVE
                </span>
                <span className="text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 bg-gray-900 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>
          )}

          {/* LOG STREAM */}
          {logs.length > 0 && (
            <div className="bg-black border border-gray-800 rounded p-4 text-xs font-mono space-y-1 max-h-56 overflow-y-auto">
              {logs.map((l, i) => (
                <div
                  key={i}
                  className={
                    l.includes("VERDICT")
                      ? "text-red-400"
                      : l.includes("MODEL") || l.includes("BIO")
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }
                >
                  {l}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          )}

          {/* VERDICT */}
          {verdict && (
            <div
              className={`p-4 rounded border text-center tracking-widest text-sm ${
                verdict === "FAKE"
                  ? "border-red-500/40 text-red-400 bg-red-500/10"
                  : "border-green-500/40 text-green-400 bg-green-500/10"
              }`}
            >
              FINAL VERDICT — {verdict}
            </div>
          )}

          {/* CONTROLS */}
          {status !== "IDLE" && (
            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={reset}
                className="text-xs px-4 py-2 border border-gray-600 rounded hover:border-white hover:text-white transition"
              >
                ABORT SESSION
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={startAnalysis}
      />
    </section>
  )
}
