"use client"
const DEMO_MODE = false
const DEMO_RESULT = { score: 80 }

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function RiskReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [score, setScore] = useState(0)
  const motionScore = useMotionValue(0)

  const displayScore = useTransform(motionScore, (v) =>
    Math.round(v)
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const finalScore = DEMO_MODE
  ? DEMO_RESULT.score
  : Math.floor(60 + Math.random() * 30)

          animate(motionScore, finalScore, {
            duration: 2,
            ease: "easeOut"
          })
          setScore(finalScore)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [motionScore])

  const isHighRisk = score >= 75

  return (
    <section
  id="risk-reveal"
  ref={containerRef}

      className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold mb-8"
      >
        Authenticity Risk Assessment
      </motion.h2>

      <div
        className={`text-8xl md:text-9xl font-bold ${
          isHighRisk ? "text-red-500" : "text-green-400"
        }`}
      >
        <motion.span>{displayScore}</motion.span>
        <span className="text-3xl align-top">%</span>
      </div>

      <p className="mt-4 text-gray-400">
        {isHighRisk
          ? "High probability of synthetic manipulation detected"
          : "Video appears likely authentic under current analysis"}
      </p>

      {/* Evidence Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {[
          "Blink Pattern Anomaly",
          "Identity Embedding Drift",
          "Compression Stress Response"
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="p-6 border border-gray-700 rounded-lg bg-[#0f0f0f]"
          >
            {item}
          </motion.div>
        ))}
      </div>

      {/* Human Review Flag */}
      {isHighRisk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 px-6 py-3 border border-red-500 text-red-500 rounded-lg"
        >
          Human Review Required
        </motion.div>
      )}
    </section>
  )
}
