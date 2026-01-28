"use client"

import { motion } from "framer-motion"
import { useHUD } from "../system/hudStore"

export default function SystemHUD() {
  const state = useHUD()

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="absolute top-4 left-6 space-y-1 font-mono text-xs tracking-widest text-indigo-400">
        <div>BACKEND: {state.backend}</div>
        <div>SESSION: {state.sessionId || "—"}</div>
        <div>STAGE: {state.stage}</div>
        <div>LATENCY: {state.latency}ms</div>
      </div>

      <div className="absolute top-4 right-6 flex items-center gap-2 font-mono text-xs tracking-widest">
        <span
          className={`h-2 w-2 rounded-full ${
            state.stream ? "bg-green-400" : "bg-red-500"
          }`}
        />
        <span className="text-gray-400">
          {state.stream ? "STREAM LIVE" : "NO STREAM"}
        </span>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span
          className={`${
            state.verdict === "FAKE"
              ? "text-red-400"
              : state.verdict === "UNCERTAIN"
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          VERDICT: {state.verdict}
        </span>
      </motion.div>
    </div>
  )
}