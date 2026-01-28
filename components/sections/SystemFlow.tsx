"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { useForensicSession } from "../system/ForensicSession"

const ForensicHead = dynamic(
  () => import("../layout/ForensicHead"),
  { ssr: false }
)

function toVisualVerdict(
  verdict: "FAKE" | "UNCERTAIN" | "LIKELY AUTHENTIC"
): "FAKE" | "REAL" {
  return verdict === "FAKE" ? "FAKE" : "REAL"
}

export default function SystemFlow() {
  const { forensic } = useForensicSession()

  if (!forensic) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center text-gray-500">
        Awaiting forensic stream…
      </section>
    )
  }

  const visualForensic = {
    ...forensic,
    verdict: toVisualVerdict(forensic.verdict)
  }

  return (
    <section className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <ForensicHead forensic={visualForensic} />
          </div>

          <p className="mt-6 tracking-widest text-sm text-indigo-400">
            VERDICT — {forensic.verdict}
          </p>
        </div>

        <div className="space-y-4">
          <div className="font-mono text-xs border border-gray-700 p-4 rounded">
            rPPG BPM: {forensic.rppg.bpm.toFixed(1)}
          </div>

          <div className="font-mono text-xs border border-gray-700 p-4 rounded">
            Identity Drift: {forensic.identity.drift.toFixed(2)}
          </div>

          <div className="font-mono text-xs border border-gray-700 p-4 rounded">
            Depth:
            {forensic.depth.valid
              ? " VALID"
              : " INVALID"}{" "}
            | Violations:{" "}
            {forensic.depth.violations}
          </div>
        </div>
      </div>
    </section>
  )
}