"use client"

import { motion } from "framer-motion"
import { useState, useMemo } from "react"

type Stage = {
  title: string
  desc: string
  risk: "LOW" | "MEDIUM" | "HIGH"
  impact: string
  backend: string[]
}

const STAGES: Stage[] = [
  {
    title: "INGEST",
    desc: "Media integrity & capture survivability",
    impact: "Establishes whether source media is trustworthy before analysis begins.",
    risk: "LOW",
    backend: [
      "[TIER-0] Capture Likelihood: 0.70",
      "[TIER-0] Survivability: HIGH",
      "[TIER-0] Likely Derived: False",
      "[TIER-0] Notes: over_smooth_motion"
    ]
  },
  {
    title: "BIOMETRICS",
    desc: "Physiological & behavioral extraction",
    impact: "Detects synthetic signals by analyzing pulse, facial behavior, and gaze stability.",
    risk: "MEDIUM",
    backend: [
      "[rPPG] BPM: 73.7",
      "[rPPG] SNR: 1.70",
      "[HRV] 0.20",
      "[MicroExpr] Count: 23 | Mean: 33ms",
      "[EyeConv] Avg: 3.5° | Fail: 0.0"
    ]
  },
  {
    title: "SCENE ANALYSIS",
    desc: "Lighting & compression consistency",
    impact: "Identifies unnatural lighting patterns and codec artifacts common in generated media.",
    risk: "LOW",
    backend: [
      "[Lighting] Variance: 22.84",
      "[Compression] Artifacts: NORMAL"
    ]
  },
  {
    title: "DEPTH & MOTION",
    desc: "3D consistency & frame stability",
    impact: "Flags spatial distortions and motion errors caused by AI depth hallucination.",
    risk: "HIGH",
    backend: [
      "[Depth] MiDaS VALID: False",
      "[Depth] Violations: 93",
      "[Motion] Std: 1.04"
    ]
  },
  {
    title: "IDENTITY & TEMPORAL",
    desc: "Cross-frame subject validation",
    impact: "Detects identity drift and frame desynchronization across the timeline.",
    risk: "HIGH",
    backend: [
      "[Identity] Drift: 9.59",
      "[Phase] Corr: -0.59",
      "[Lag] Frames: 39"
    ]
  },
  {
    title: "FINAL VERDICT",
    desc: "Weighted ensemble confidence",
    impact: "Fuses all forensic signals into a single authenticity probability.",
    risk: "HIGH",
    backend: [
      ">>> Verdict: FAKE",
      ">>> P(real): 0.000"
    ]
  }
]

export default function EvidencePipeline() {
  const [active, setActive] = useState(0)

  const riskColor = (risk: Stage["risk"]) => {
    if (risk === "HIGH") return "text-red-400 border-red-500/40"
    if (risk === "MEDIUM") return "text-yellow-400 border-yellow-500/40"
    return "text-green-400 border-green-500/40"
  }

  // SYSTEM RISK SUMMARY
  const systemRisk = useMemo(() => {
    const high = STAGES.filter(s => s.risk === "HIGH").length
    if (high >= 3) return "CRITICAL"
    if (high >= 1) return "ELEVATED"
    return "STABLE"
  }, [])

  const progress = Math.round(((active + 1) / STAGES.length) * 100)

  return (
    <section
      id="pipeline"
      className="min-h-screen bg-black text-white flex items-center justify-center px-10"
    >
      <div className="w-full max-w-6xl space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Forensic Evidence Pipeline
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            This system evaluates media authenticity by extracting biometric,
            spatial, temporal, and compression-domain signals, then fusing them
            into a single probabilistic verdict.
          </p>
        </motion.div>

        {/* SYSTEM SUMMARY */}
        <div className="border border-gray-800 rounded-xl bg-[#050505] p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <p className="tracking-widest text-xs text-gray-500">
              SYSTEM RISK STATUS
            </p>
            <p
              className={`text-2xl font-bold ${
                systemRisk === "CRITICAL"
                  ? "text-red-400"
                  : systemRisk === "ELEVATED"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {systemRisk}
            </p>
          </div>

          <div className="w-full md:w-1/2">
            <p className="text-xs tracking-widest text-gray-500 mb-2">
              PIPELINE PROGRESS
            </p>
            <div className="w-full h-2 bg-gray-900 rounded overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {progress}% of forensic pipeline completed
            </p>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* LEFT — PIPELINE TIMELINE */}
          <div className="space-y-6">
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent" />

              {STAGES.map((stage, i) => {
                const selected = i === active

                return (
                  <motion.div
                    key={stage.title}
                    onClick={() => setActive(i)}
                    whileHover={{ scale: 1.02 }}
                    className={`mb-6 cursor-pointer p-5 rounded-lg border transition ${
                      selected
                        ? "border-indigo-500 bg-[#0f0f0f]"
                        : "border-gray-800 bg-[#080808]"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="tracking-widest text-sm text-indigo-400">
                        {stage.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${riskColor(
                          stage.risk
                        )}`}
                      >
                        RISK: {stage.risk}
                      </span>
                    </div>

                    <p className="text-gray-400 text-xs mb-1">
                      {stage.desc}
                    </p>

                    {selected && (
                      <p className="text-xs text-indigo-300">
                        Impact: {stage.impact}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* RIGHT — BACKEND EVIDENCE VIEW */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-gray-800 rounded-xl bg-[#050505] p-6 shadow-[0_0_40px_rgba(124,124,255,0.15)]"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="tracking-widest text-sm text-indigo-400">
                LIVE FORENSIC OUTPUT
              </h3>
              <span className="text-xs text-gray-500">
                MODULE: {STAGES[active].title}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {STAGES[active].backend.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={
                    line.includes("FAKE")
                      ? "text-red-400"
                      : line.includes("INVALID") ||
                        line.includes("Violations") ||
                        line.includes("Drift")
                      ? "text-yellow-400"
                      : "text-gray-400"
                  }
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* STAGE INSIGHT */}
            <div className="mt-6 border-t border-gray-800 pt-4 text-xs text-gray-400">
              <span className="text-indigo-400 tracking-widest">
                ANALYST NOTE:
              </span>{" "}
              This stage contributes directly to the system confidence index and
              influences the final authenticity probability shown in the verdict
              panel below.
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
