"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

const pipelineStages = [
  "[BOOT] cli.main loaded",
  "[TIER-0] Capture likelihood: 0.7, Survivability: HIGH, Likely derived: False",
  "[TIER-0] Notes: over_smooth_motion",
  "INFO: Created TensorFlow Lite XNNPACK delegate for CPU.",
  "[OK] Extracted data for 1 face(s)",
  "Using cache: MiDaS depth model",
  "Loading ViT identity encoder",
  "Running rPPG biological signal extraction",
  "Evaluating micro-expressions & eye convergence",
  "Computing temporal + compression domain metrics",
  "Fusing forensic evidence models",
  ">>> Verdict: FAKE",
  ">>> P(real): 0.000"
]

export default function MediaIntake() {
  const inputRef = useRef<HTMLInputElement>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>("IDLE")
  const [analyzing, setAnalyzing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  const pushLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-14), msg])
  }

  const startAnalysis = () => {
    if (analyzing) return

    setAnalyzing(true)
    setProgress(0)
    setLogs([])
    setStatus("RUNNING")

    let p = 0
    let step = 0

    const interval = setInterval(() => {
      p += 100 / pipelineStages.length

      if (step < pipelineStages.length) {
        pushLog(pipelineStages[step])
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
    }, 550)
  }

  return (
    <section className="bg-black text-white flex flex-col items-center justify-center px-10 py-32">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-10 tracking-wide"
      >
        Media Verification Console
      </motion.h2>

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
          </div>

          {/* STATUS BAR */}
          {analyzing && (
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
                    l.includes(">>> Verdict")
                      ? "text-red-400"
                      : l.includes("[TIER-0]")
                      ? "text-indigo-400"
                      : "text-gray-400"
                  }
                >
                  {l}
                </div>
              ))}
              <div ref={logEndRef} />
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
