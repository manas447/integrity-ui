"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

/* ======================
   FORENSIC CONFIG
====================== */

const forensicGroups = [
  {
    title: "Biological Signals",
    weight: 0.22,
    signals: [
      { name: "rPPG Heart Rate", value: "73 BPM", score: 72, status: "VALID" },
      { name: "rPPG SNR", value: "1.70", score: 35, status: "LOW CONF" },
      { name: "HRV", value: "0.20", score: 68, status: "VALID" }
    ]
  },
  {
    title: "Micro-Behavior",
    weight: 0.18,
    signals: [
      { name: "Micro-Expressions", value: "23 detected", score: 78, status: "VALID" },
      { name: "Mean Duration", value: "33 ms", score: 74, status: "VALID" },
      { name: "Eye Convergence", value: "3.5°", score: 82, status: "STABLE" }
    ]
  },
  {
    title: "Scene Integrity",
    weight: 0.25,
    signals: [
      { name: "Lighting Variance", value: "22.8", score: 80, status: "NORMAL" },
      { name: "Depth Motion", value: "1.04", score: 74, status: "VALID" },
      { name: "MiDaS Depth", value: "93 Violations", score: 10, status: "FAIL" }
    ]
  },
  {
    title: "Identity & Temporal",
    weight: 0.35,
    signals: [
      { name: "Identity Drift", value: "9.59", score: 20, status: "HIGH" },
      { name: "Phase Correlation", value: "-0.59", score: 25, status: "ANOMALY" },
      { name: "Temporal Lag", value: "39 frames", score: 40, status: "DETECTED" }
    ]
  }
]

const backendStream = [
  "[TIER-0] Capture Likelihood: 0.70",
  "[TIER-0] Survivability: HIGH",
  "[TIER-0] Likely Derived: False",
  "[rPPG] BPM: 73.7 | SNR: 1.70 | HRV: 0.20",
  "[MicroExpr] Count: 23 | Mean: 33ms",
  "[EyeConv] Avg: 3.5° | Fail: 0.0",
  "[Depth] MiDaS VALID: False",
  "[Depth] Violations: 93",
  "[Identity] Drift: 9.59",
  "[Phase] Corr: -0.59",
  "[Lag] Frames: 39",
  "[Fusion] Model Ensemble Agreement: 93%",
  ">>> Verdict: FAKE",
  ">>> P(real): 0.000"
]

/* ======================
   COMPONENT
====================== */

export default function SignalDashboard() {
  const [logs, setLogs] = useState<string[]>([])
  const [tick, setTick] = useState(0)

  /* === Weighted Fusion Score === */
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

  const verdict =
    fusionScore < 50
      ? "FAKE"
      : fusionScore < 70
      ? "UNCERTAIN"
      : "LIKELY AUTHENTIC"

  const confidenceBand =
    fusionScore < 50
      ? "HIGH RISK"
      : fusionScore < 70
      ? "MEDIUM RISK"
      : "LOW RISK"

  const topFindings = [
    "Identity drift exceeded stability threshold",
    "MiDaS depth model failed geometric consistency",
    "rPPG signal-to-noise ratio below confidence band"
  ]

  /* === Simulated Live Backend Stream === */
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = backendStream[tick % backendStream.length]
        return [...prev.slice(-10), next]
      })
      setTick(t => t + 1)
    }, 900)

    return () => clearInterval(interval)
  }, [tick])

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Model Fusion & Evidence Console
      </motion.h2>

      <div className="w-full max-w-6xl space-y-10">

        {/* ======================
            SYSTEM SUMMARY BAR
        ====================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-between items-center border border-indigo-500/40 rounded-xl p-6 bg-[#0b0b0b]"
        >
          <div className="text-sm tracking-widest text-gray-400">
            FACE COUNT
            <div className="text-xl text-white mt-1">1</div>
          </div>

          <div className="text-sm tracking-widest text-gray-400">
            VERDICT
            <div
              className={`text-xl mt-1 ${
                verdict === "FAKE"
                  ? "text-red-400"
                  : verdict === "UNCERTAIN"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {verdict}
            </div>
          </div>

          <div className="text-sm tracking-widest text-gray-400">
            CONFIDENCE
            <div className="text-xl text-indigo-400 mt-1">
              {fusionScore}%
            </div>
          </div>

          <div className="text-sm tracking-widest text-gray-400">
            RISK BAND
            <div className="text-xl text-white mt-1">
              {confidenceBand}
            </div>
          </div>
        </motion.div>

        {/* ======================
            LIVE FORENSIC STREAM
        ====================== */}
        <div className="border border-gray-800 rounded-xl bg-[#050505] p-6 font-mono text-xs space-y-2 max-h-56 overflow-y-auto shadow-[0_0_30px_rgba(124,124,255,0.12)]">
          <div className="text-indigo-400 tracking-widest mb-2">
            LIVE BACKEND FORENSIC STREAM
          </div>

          {logs.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
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

        {/* ======================
            RISK DRIVERS
        ====================== */}
        <div className="border border-red-500/30 rounded-xl p-6 bg-[#0f0f0f]">
          <h3 className="text-sm tracking-widest text-red-400 mb-4">
            PRIMARY RISK DRIVERS
          </h3>

          <ul className="space-y-2 text-sm text-gray-300">
            {topFindings.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-400">●</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* ======================
            SIGNAL GROUPS
        ====================== */}
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
      </div>
    </section>
  )
}
