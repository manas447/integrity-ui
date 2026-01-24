"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

const forensicGroups = [
  {
    title: "Biological Signals",
    weight: 0.22,
    signals: [
      { name: "rPPG Heart Rate", value: "73 BPM", score: 72, status: "VALID" },
      { name: "rPPG SNR", value: "1.70", score: 45, status: "LOW CONF" },
      { name: "HRV", value: "0.20", score: 70, status: "VALID" }
    ]
  },
  {
    title: "Micro-Behavior",
    weight: 0.18,
    signals: [
      { name: "Micro-Expressions", value: "23 detected", score: 78, status: "VALID" },
      { name: "Mean Duration", value: "33 ms", score: 75, status: "VALID" },
      { name: "Eye Convergence", value: "3.5°", score: 82, status: "STABLE" }
    ]
  },
  {
    title: "Scene Integrity",
    weight: 0.25,
    signals: [
      { name: "Lighting Variance", value: "22.8", score: 80, status: "NORMAL" },
      { name: "Depth Motion", value: "1.04", score: 76, status: "VALID" },
      { name: "MiDaS Depth", value: "93 Violations", score: 15, status: "FAIL" }
    ]
  },
  {
    title: "Identity & Temporal",
    weight: 0.35,
    signals: [
      { name: "Identity Drift", value: "9.59", score: 30, status: "HIGH" },
      { name: "Phase Correlation", value: "-0.59", score: 25, status: "ANOMALY" },
      { name: "Temporal Lag", value: "39 frames", score: 40, status: "DETECTED" }
    ]
  }
]

export default function SignalDashboard() {
  // Weighted fusion score
  const fusionScore = useMemo(() => {
    let total = 0

    forensicGroups.forEach(group => {
      const avg =
        group.signals.reduce((a, s) => a + s.score, 0) /
        group.signals.length

      total += avg * group.weight
    })

    return Math.round(total)
  }, [])

  const needsReview = fusionScore < 70

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-12"
      >
        Model Fusion & Evidence Console
      </motion.h2>

      <div className="w-full max-w-5xl space-y-10">

        {/* FORENSIC GROUPS */}
        {forensicGroups.map((group, i) => (
          <div
            key={i}
            className="border border-gray-800 rounded-xl p-6 bg-[#0f0f0f]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg tracking-widest text-indigo-400">
                {group.title.toUpperCase()}
              </h3>
              <span className="text-xs text-gray-500">
                Weight: {(group.weight * 100).toFixed(0)}%
              </span>
            </div>

            <div className="space-y-3">
              {group.signals.map((s, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-gray-800 pb-2 text-sm"
                >
                  <span className="text-gray-300">
                    {s.name}
                  </span>

                  <div className="flex gap-4 items-center">
                    <span className="text-gray-400">
                      {s.value}
                    </span>

                    <span className="text-indigo-400 text-xs">
                      {s.score}%
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-xs tracking-widest ${
                        s.status === "FAIL"
                          ? "bg-red-500/20 text-red-400"
                          : s.status.includes("ANOMALY") ||
                            s.status.includes("HIGH") ||
                            s.status.includes("LOW")
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* SYSTEM CONFIDENCE INDEX */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="border border-indigo-500/40 rounded-xl p-8 bg-[#0b0b0b] text-center"
        >
          <p className="tracking-widest text-gray-400 mb-3">
            SYSTEM CONFIDENCE INDEX
          </p>

          <div
            className={`text-7xl font-bold ${
              fusionScore < 50
                ? "text-red-500"
                : fusionScore < 70
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {fusionScore}%
          </div>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Score derived from weighted fusion of biometric stability,
            scene consistency, compression-domain analysis, and
            ensemble model agreement.
          </p>

          {needsReview && (
            <div className="mt-6 inline-block px-6 py-2 border border-red-500 text-red-400 rounded-lg tracking-widest text-sm">
              HUMAN REVIEW REQUIRED
            </div>
          )}
        </motion.div>

      </div>
    </section>
  )
}
