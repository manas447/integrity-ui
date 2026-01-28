"use client"

import { motion } from "framer-motion"
import type { VerdictState } from "../system/uiTypes"

type Props = {
  verdict: VerdictState | null
  confidence: number | null
}

export default function VerdictCard({
  verdict,
  confidence
}: Props) {
  const color =
    verdict === "FAKE"
      ? "text-red-400 border-red-500/40 bg-red-500/5"
      : verdict === "LIKELY AUTHENTIC"
      ? "text-green-400 border-green-500/40 bg-green-500/5"
      : "text-indigo-400 border-indigo-500/40 bg-indigo-500/5"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`w-full max-w-xl mx-auto mb-16 border rounded-xl px-8 py-6 ${color}`}
    >
      <p className="text-xs tracking-widest mb-2 opacity-70">
        SYSTEM VERDICT
      </p>

      <div className="flex items-end justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wider">
          {verdict ?? "AWAITING DATA"}
        </h1>

        <span className="text-sm tracking-widest opacity-70">
          {confidence !== null
            ? `CONFIDENCE ${confidence}%`
            : "NO CONFIDENCE"}
        </span>
      </div>
    </motion.div>
  )
}