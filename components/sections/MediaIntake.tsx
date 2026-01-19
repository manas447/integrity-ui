"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

const stages = [
  "Extracting Frames",
  "Analyzing Facial Landmarks",
  "Evaluating Signal Noise",
  "Cross-Checking Identity Embeddings",
  "Synthesizing Evidence"
]

export default function MediaIntake() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const startAnalysis = () => {
    if (analyzing) return

    setAnalyzing(true)
    let p = 0
    let stageIndex = 0

    setStatus(stages[0])

    const interval = setInterval(() => {
      p += Math.random() * 12

      if (p >= 100) {
        p = 100
        setProgress(p)
        setStatus("Analysis Complete")
        clearInterval(interval)
        setAnalyzing(false)

        // Auto-scroll to risk section
        setTimeout(() => {
          document
            .getElementById("risk-reveal")
            ?.scrollIntoView({ behavior: "smooth" })
        }, 800)
      } else {
        setProgress(p)
        if (p > (stageIndex + 1) * (100 / stages.length)) {
          stageIndex++
          setStatus(stages[stageIndex])
        }
      }
    }, 400)
  }

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-8"
      >
        Submit Media for Verification
      </motion.h2>

      <div
        onClick={() => inputRef.current?.click()}
        className="w-full max-w-xl h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-white transition"
      >
        <p className="text-gray-400">
          Drag & drop video or image here
        </p>
        <p className="text-sm text-gray-600 mt-2">
          MP4, MOV, JPG, PNG (Max 50MB)
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={startAnalysis}
      />

      {status && (
        <div className="mt-8 w-full max-w-xl">
          <div className="flex justify-between text-sm mb-2">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded">
            <div
              className="h-full bg-white rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
