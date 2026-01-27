"use client"

import { motion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { useForensicSession } from "../system/ForensicSession"

type Point = {
  t: number
  similarity: number
}

const MAX_POINTS = 40
const THRESHOLD = 0.7

export default function DriftTimeline() {
  const { forensic } = useForensicSession()
  const [points, setPoints] = useState<Point[]>([])
  const startTimeRef = useRef<number | null>(null)

  /* ======================
     DATA INGEST
  ====================== */
  useEffect(() => {
    if (!forensic) return

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    // Map identity drift → similarity (0–1)
    const similarity = Math.max(
      0,
      Math.min(1, 1 - forensic.identity.drift / 10)
    )

    const t = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    )

    setPoints(prev => {
      const next = [...prev, { t, similarity }]
      return next.slice(-MAX_POINTS)
    })
  }, [forensic])

  /* ======================
     SVG PATH
  ====================== */
  const path = useMemo(() => {
    if (points.length < 2) return ""

    return points
      .map((p, i) => {
        const x = (i / (MAX_POINTS - 1)) * 100
        const y = 100 - p.similarity * 100
        return `${i === 0 ? "M" : "L"} ${x},${y}`
      })
      .join(" ")
  }, [points])

  const riskBand = useMemo(() => {
    if (!points.length) return "STABLE"

    const recent = points[points.length - 1].similarity

    if (recent < 0.7) return "CRITICAL"
    if (recent < 0.85) return "ELEVATED"
    return "STABLE"
  }, [points])

  /* ======================
     UI
  ====================== */
  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Face Identity Drift Timeline
      </motion.h2>

      <div className="w-full max-w-5xl border border-gray-800 rounded-xl bg-[#050505] p-8 space-y-8">

        {/* ======================
            SUMMARY BAR
        ====================== */}
        <div className="flex flex-wrap justify-between items-center border border-indigo-500/40 rounded-lg p-4 bg-[#0b0b0b]">
          <div className="text-xs tracking-widest text-gray-400">
            CURRENT SIMILARITY
            <div className="text-xl text-white mt-1">
              {points.length
                ? points[points.length - 1].similarity.toFixed(3)
                : "—"}
            </div>
          </div>

          <div className="text-xs tracking-widest text-gray-400">
            THRESHOLD
            <div className="text-xl text-yellow-400 mt-1">
              {THRESHOLD.toFixed(2)}
            </div>
          </div>

          <div className="text-xs tracking-widest text-gray-400">
            RISK BAND
            <div
              className={`text-xl mt-1 ${
                riskBand === "CRITICAL"
                  ? "text-red-400"
                  : riskBand === "ELEVATED"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {riskBand}
            </div>
          </div>
        </div>

        {/* ======================
            GRAPH
        ====================== */}
        <div className="relative border border-gray-700 rounded-lg p-4 bg-black">

          {/* Y-Axis Labels */}
          <div className="absolute left-2 top-2 text-xs text-gray-500">
            1.0
          </div>
          <div className="absolute left-2 bottom-2 text-xs text-gray-500">
            0.0
          </div>

          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-64"
          >
            {/* Threshold Line */}
            <line
              x1="0"
              y1={100 - THRESHOLD * 100}
              x2="100"
              y2={100 - THRESHOLD * 100}
              stroke="rgba(255,255,0,0.4)"
              strokeDasharray="4 4"
            />

            {/* Drift Path */}
            <motion.path
              d={path}
              fill="none"
              stroke={
                riskBand === "CRITICAL"
                  ? "#f87171"
                  : riskBand === "ELEVATED"
                  ? "#facc15"
                  : "#4ade80"
              }
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          </svg>

          {/* X-Axis Label */}
          <div className="text-xs tracking-widest text-gray-500 text-center mt-2">
            TIME WINDOW (SECONDS)
          </div>
        </div>

        {/* ======================
            ANALYST NOTES
        ====================== */}
        <div className="border border-gray-800 rounded-lg p-4 bg-[#0b0b0b] text-xs text-gray-400">
          <span className="text-indigo-400 tracking-widest">
            ANALYST NOTE:
          </span>{" "}
          Identity similarity is computed using face embedding cosine
          similarity across consecutive frames. Sustained drops below
          the threshold indicate high probability of face swap or
          identity substitution.
        </div>
      </div>
    </section>
  )
}
