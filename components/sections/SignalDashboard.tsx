"use client"
const DEMO_MODE = false
const DEMO_RESULT = { signals: [] }

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const signals = [
  { name: "Temporal Consistency", weight: 0.22 },
  { name: "Identity Stability", weight: 0.18 },
  { name: "Biological Signals", weight: 0.16 },
  { name: "Entropy Drift", weight: 0.14 },
  { name: "Compression Artifacts", weight: 0.15 },
  { name: "Model Ensemble Agreement", weight: 0.15 }
]

export default function SignalDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<number[]>(
    Array(signals.length).fill(0)
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const generated = DEMO_MODE
  ? DEMO_RESULT.signals
  : signals.map(() => Math.floor(50 + Math.random() * 50))

          setValues(generated)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-12"
      >
        Forensic Signal Breakdown
      </motion.h2>

      <div className="w-full max-w-4xl space-y-6">
        {signals.map((signal, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{signal.name}</span>
              <span>{values[i]}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${values[i]}%` }}
                transition={{ duration: 1.2, delay: i * 0.2 }}
                className="h-full bg-white rounded"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-gray-400 max-w-3xl text-center">
        Risk score is computed using a weighted ensemble of biological,
        statistical, and compression-domain signals. Human review is
        recommended when model agreement falls below confidence
        thresholds.
      </p>
    </section>
  )
}
