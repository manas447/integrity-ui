"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const verdict = {
  result: "FAKE",
  probabilityReal: 0.0,
  systemConfidence: 81,
  tier0: {
    captureLikelihood: 0.7,
    survivability: "HIGH",
    derived: false,
    notes: "over_smooth_motion"
  },
  riskDrivers: [
    "MiDaS depth violations detected (93 frames)",
    "High identity drift across frame window",
    "Negative phase correlation (-0.59)",
    "Low rPPG signal confidence"
  ]
}

export default function RiskReveal() {
  const isFake = verdict.result === "FAKE"

  // Hydration-safe timestamp
  const [timestamp, setTimestamp] = useState<string>("—")

  useEffect(() => {
    setTimestamp(new Date().toISOString())
  }, [])

  return (
    <section
      id="risk-reveal"
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10"
    >
      {/* HEADER */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Final Authenticity Assessment
      </motion.h2>

      {/* VERDICT PANEL */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-800 rounded-xl bg-[#050505] p-8 shadow-[0_0_60px_rgba(124,124,255,0.15)]">

        {/* LEFT — DECISION */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`text-7xl md:text-8xl font-bold tracking-widest ${
              isFake ? "text-red-500" : "text-green-400"
            }`}
          >
            {verdict.result}
          </div>

          <div className="text-gray-400 text-sm">
            P(Real): {verdict.probabilityReal.toFixed(3)}
          </div>

          {/* CONFIDENCE RING */}
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1f1f1f"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isFake ? "#ef4444" : "#22c55e"}
                strokeWidth="6"
                strokeDasharray={`${verdict.systemConfidence * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
              {verdict.systemConfidence}%
            </div>
          </div>

          <div className="text-xs tracking-widest text-gray-500">
            SYSTEM CONFIDENCE INDEX
          </div>
        </div>

        {/* RIGHT — EVIDENCE */}
        <div className="space-y-6">

          {/* TIER-0 */}
          <div className="border border-gray-800 rounded-lg p-4 bg-[#0b0b0b] font-mono text-xs space-y-1">
            <div className="text-indigo-400 tracking-widest mb-2">
              TIER-0 CAPTURE METRICS
            </div>
            <div>[Capture] Likelihood: {verdict.tier0.captureLikelihood}</div>
            <div>[Capture] Survivability: {verdict.tier0.survivability}</div>
            <div>[Capture] Likely Derived: {verdict.tier0.derived.toString()}</div>
            <div>[Capture] Notes: {verdict.tier0.notes}</div>
          </div>

          {/* TIMESTAMP */}
          <div className="border border-gray-800 rounded-lg p-3 bg-[#0b0b0b] text-xs font-mono">
            <span className="text-indigo-400 tracking-widest block mb-1">
              TIMESTAMP
            </span>
            <div className="text-gray-400">{timestamp}</div>
          </div>

          {/* RISK DRIVERS */}
          <div className="border border-gray-800 rounded-lg p-4 bg-[#0b0b0b]">
            <div className="text-indigo-400 tracking-widest text-xs mb-3">
              PRIMARY RISK DRIVERS
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              {verdict.riskDrivers.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2"
                >
                  <span className="text-red-400">●</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FOOTNOTE */}
      <div className="mt-10 max-w-2xl text-center text-gray-500 text-sm">
        This verdict is derived from weighted fusion of biometric stability,
        depth consistency analysis, compression domain forensics, and ensemble
        model agreement. Human review is recommended for legal or
        high-stakes decisions.
      </div>
    </section>
  )
}
