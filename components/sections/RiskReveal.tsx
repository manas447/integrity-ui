"use client"

import { motion } from "framer-motion"

const verdict = {
  result: "FAKE",
  probabilityReal: 0.000,
  tier0: {
    captureLikelihood: 0.7,
    survivability: "HIGH",
    derived: false,
    notes: "over_smooth_motion"
  }
}

export default function RiskReveal() {
  const isFake = verdict.result === "FAKE"

  return (
    <section
      id="risk-reveal"
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Final Authenticity Verdict
      </motion.h2>

      <div
        className={`text-9xl font-bold tracking-widest ${
          isFake ? "text-red-500" : "text-green-400"
        }`}
      >
        {verdict.result}
      </div>

      <div className="mt-4 text-gray-400">
        P(Real): {verdict.probabilityReal.toFixed(3)}
      </div>

      {/* Tier 0 Console */}
      <div className="mt-12 w-full max-w-3xl border border-gray-800 rounded-xl bg-[#0f0f0f] p-6 font-mono text-sm space-y-2">
        <div>
          <span className="text-gray-500">[TIER-0]</span>{" "}
          Capture Likelihood: {verdict.tier0.captureLikelihood}
        </div>
        <div>
          <span className="text-gray-500">[TIER-0]</span>{" "}
          Survivability: {verdict.tier0.survivability}
        </div>
        <div>
          <span className="text-gray-500">[TIER-0]</span>{" "}
          Likely Derived: {verdict.tier0.derived.toString()}
        </div>
        <div>
          <span className="text-gray-500">[TIER-0]</span>{" "}
          Notes: {verdict.tier0.notes}
        </div>
      </div>

      <div className="mt-8 text-gray-500 max-w-xl text-center">
        Verdict is generated using biometric validation, physical scene
        consistency, identity drift modeling, and ensemble depth analysis.
        Human review is recommended for legal or high-stakes use.
      </div>
    </section>
  )
}
