"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useForensicSession } from "../system/ForensicSession"
import type { ForensicReport } from "../export/types"

export default function RiskReveal() {
  const { forensic, buildReport } = useForensicSession()

  const [timestamp, setTimestamp] = useState("—")
  const [report, setReport] =
    useState<ForensicReport | null>(null)

  useEffect(() => {
    setTimestamp(new Date().toISOString())
  }, [])

  useEffect(() => {
    let mounted = true

    async function generate() {
      if (!forensic) return
      const r = await buildReport()
      if (mounted) setReport(r)
    }

    generate()
    return () => {
      mounted = false
    }
  }, [forensic, buildReport])

  if (!report) {
    return (
      <section
        id="risk-reveal"
        className="min-h-screen bg-black text-white flex items-center justify-center"
      >
        <p className="text-gray-500 tracking-widest text-xs">
          Awaiting forensic state…
        </p>
      </section>
    )
  }

  const isFake = report.verdict.result === "FAKE"

  return (
    <section
      id="risk-reveal"
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Final Authenticity Assessment
      </motion.h2>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-800 rounded-xl bg-[#050505] p-8">

        {/* LEFT — VERDICT */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div
            className={`text-7xl md:text-8xl font-bold tracking-widest ${
              isFake
                ? "text-red-500"
                : "text-green-400"
            }`}
          >
            {report.verdict.result}
          </div>

          <div className="text-gray-400 text-sm">
            P(Real):{" "}
            {report.verdict.probabilityReal.toFixed(3)}
          </div>

          <div className="text-xs tracking-widest text-gray-500">
            SYSTEM CONFIDENCE INDEX
          </div>

          <div className="text-indigo-400 text-2xl font-mono">
            {report.verdict.systemConfidence}%
          </div>
        </div>

        {/* RIGHT — DETAILS */}
        <div className="space-y-6">
          <div className="border border-gray-800 rounded-lg p-4 bg-[#0b0b0b] font-mono text-xs space-y-1">
            <div className="text-indigo-400 mb-2">
              TIER-0 CAPTURE METRICS
            </div>
            <div>
              Likelihood:{" "}
              {report.tier0.captureLikelihood}
            </div>
            <div>
              Survivability:{" "}
              {report.tier0.survivability}
            </div>
            <div>
              Derived:{" "}
              {report.tier0.derived.toString()}
            </div>
            <div>
              Notes: {report.tier0.notes}
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-3 bg-[#0b0b0b] text-xs font-mono">
            <span className="text-indigo-400 block mb-1">
              TIMESTAMP
            </span>
            <div className="text-gray-400">
              {timestamp}
            </div>
          </div>

          <div className="border border-gray-800 rounded-lg p-4 bg-[#0b0b0b]">
            <div className="text-indigo-400 text-xs mb-3">
              PRIMARY RISK DRIVERS
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              {report.riskDrivers.map(
                (r: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-2"
                  >
                    <span className="text-red-400">
                      ●
                    </span>
                    {r}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
