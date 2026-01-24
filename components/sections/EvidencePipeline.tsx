"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const STAGES = [
  {
    title: "INGEST",
    desc: "Capture likelihood, survivability, codec integrity",
    signals: ["Capture Likelihood", "SurVIVABILITY", "Derived Media Check"]
  },
  {
    title: "BIOMETRICS",
    desc: "Physiological & behavioral signals",
    signals: ["rPPG BPM", "Heart Rate Variability", "Micro-Expressions", "Eye Convergence"]
  },
  {
    title: "SCENE ANALYSIS",
    desc: "Environment & lighting validation",
    signals: ["Lighting Variance", "Compression Artifacts"]
  },
  {
    title: "DEPTH & MOTION",
    desc: "3D consistency & frame dynamics",
    signals: ["MiDaS Depth Validity", "Motion Std Deviation"]
  },
  {
    title: "IDENTITY & TEMPORAL",
    desc: "Subject consistency across frames",
    signals: ["Identity Drift", "Phase Correlation", "Temporal Lag"]
  },
  {
    title: "FINAL VERDICT",
    desc: "Weighted ensemble confidence",
    signals: ["Model Agreement", "P(Real)", "Authenticity Score"]
  }
]

export default function EvidencePipeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      const visible = Math.min(
        1,
        Math.max(0, 1 - rect.top / (windowHeight * 1.1))
      )

      setProgress(visible)
    }

    window.addEventListener("scroll", onScroll)
    onScroll()

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black text-white flex items-center justify-center"
    >
      <div className="w-full max-w-4xl space-y-10">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold text-center"
        >
          Forensic Evidence Pipeline
        </motion.h2>

        <div className="relative pl-6">

          {/* Vertical Flow Line */}
          <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />

          {STAGES.map((stage, i) => {
            const unlocked = progress > i / STAGES.length

            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: -20 }}
                animate={unlocked ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className={`mb-8 p-5 rounded-lg border ${
                  unlocked
                    ? "border-indigo-500/50 bg-[#0f0f0f]"
                    : "border-gray-800 bg-[#080808]"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="tracking-widest text-sm text-indigo-400">
                    {stage.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {unlocked ? "ACTIVE" : "PENDING"}
                  </span>
                </div>

                <p className="text-gray-400 text-xs mb-3">
                  {stage.desc}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {stage.signals.map((sig) => (
                    <div
                      key={sig}
                      className={`px-2 py-1 rounded border ${
                        unlocked
                          ? "border-indigo-500/30 text-indigo-300"
                          : "border-gray-700 text-gray-600"
                      }`}
                    >
                      {sig}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
