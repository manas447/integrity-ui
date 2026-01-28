"use client"

import { motion } from "framer-motion"
import { useForensicSession } from "../system/ForensicSession"

export default function RiskReveal() {
  const { forensic } = useForensicSession()

  if (!forensic) return null

  const verdict = forensic.verdict
  const isFake = verdict === "FAKE"

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

      <div className="w-full max-w-3xl border border-gray-800 rounded-xl bg-[#050505] p-10 shadow-[0_0_60px_rgba(124,124,255,0.15)] text-center space-y-6">

        <div
          className={`text-7xl font-bold tracking-widest ${
            isFake ? "text-red-500" : "text-green-400"
          }`}
        >
          {verdict}
        </div>

        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          This verdict is issued by the forensic backend based on biometric
          consistency, identity stability, spatial depth analysis, and
          temporal coherence scoring.
        </p>
      </div>
    </section>
  )
}