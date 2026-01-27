"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

const pipelineStages = [
  { tag: "BOOT", text: "cli.main loaded" },
  { tag: "TIER-0", text: "Capture likelihood: 0.70 | Survivability: HIGH" },
  { tag: "TIER-0", text: "Notes: over_smooth_motion" },
  { tag: "SYS", text: "TensorFlow Lite XNNPACK delegate initialized" },
  { tag: "OK", text: "Detected 1 face" },
  { tag: "MODEL", text: "Loading MiDaS depth model" },
  { tag: "MODEL", text: "Loading ViT identity encoder" },
  { tag: "BIO", text: "Extracting rPPG biological signals" },
  { tag: "BEHAVIOR", text: "Analyzing micro-expressions & eye convergence" },
  { tag: "FORENSICS", text: "Evaluating compression & temporal metrics" },
  { tag: "FUSION", text: "Fusing forensic evidence models" },
  { tag: "VERDICT", text: "Result: FAKE" },
  { tag: "CONF", text: "P(real): 0.000" }
]

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "image/jpeg", "image/png"]

export default function MediaIntake() {
  const inputRef = useRef<HTMLInputElement>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"IDLE" | "RUNNING" | "COMPLETE" | "ERROR">("IDLE")
  const [analyzing, setAnalyzing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const pushLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-18), msg])
  }

  const reset = () => {
    setProgress(0)
    setLogs([])
    setStatus("IDLE")
    setAnalyzing(false)
    setFileName(null)
    setError(null)
  }

  const startAnalysis = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Invalid file type. Upload MP4, MOV, JPG, or PNG.")
      setStatus("ERROR")
      return
    }

    setError(null)
    setFileName(file.name)
    setAnalyzing(true)
    setProgress(0)
    setLogs([])
    setStatus("RUNNING")

    let p = 0
    let step = 0

    const interval = setInterval(() => {
      p += 100 / pipelineStages.length

      if (step < pipelineStages.length) {
        const stage = pipelineStages[step]
        pushLog(`[${stage.tag}] ${stage.text}`)
        step++
      }

      if (p >= 100) {
        p = 100
        setProgress(p)
        setStatus("COMPLETE")

        clearInterval(interval)

        setTimeout(() => {
          document
            .getElementById("system-flow")
            ?.scrollIntoView({ behavior: "smooth" })
        }, 900)

        setAnalyzing(false)
      } else {
        setProgress(p)
      }
    }, 600)
  }

  return (
    <section
      id="media-intake"
      className="bg-black text-white flex flex-col items-center justify-center px-10 py-32"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-10 tracking-wide"
      >
        Media Verification Console
      </motion.h2>

      <p className="text-gray-400 text-sm mb-8 max-w-2xl text-center">
        Upload a video or image. The system will extract biological, identity, and compression-domain
        signals, then fuse them into a forensic authenticity probability.
      </p>

      {/* TERMINAL PANEL */}
      <div className="w-full max-w-4xl border border-gray-700 rounded-xl bg-[#050505] shadow-[0_0_50px_rgba(124,124,255,0.12)] overflow-hidden">

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
            onClick={() => inputRef.current?.click()}
            className="border border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition"
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

          {/* ERROR */}
          {error && (
            <div className="text-xs text-red-400 border border-red-500/30 bg-red-500/10 p-3 rounded">
              {error}
            </div>
          )}

          {/* STATUS BAR */}
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
                      : l.includes("TIER-0")
                      ? "text-indigo-400"
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

          {/* CONTROLS */}
          {status !== "IDLE" && (
            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={reset}
                className="text-xs px-4 py-2 border border-gray-600 rounded hover:border-white hover:text-white transition"
              >
                RESET SESSION
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
