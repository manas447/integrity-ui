"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const modules = [
  "Temporal Consistency",
  "Identity Stability",
  "Biological Signals",
  "Entropy Drift",
  "Stress Testing",
  "Evidence Fusion"
]

export default function SystemFlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".flow-module", {
        opacity: 0,
        y: 40,
        stagger: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true
        }
      })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress)
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black text-white flex items-center justify-center px-10"
    >
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: AI Core */}
<motion.div
  className="flex items-center justify-center"
  animate={{
    scale: 0.8 + progress * 0.4
  }}
  transition={{ ease: "easeOut" }}
>
  <svg
    viewBox="0 0 200 200"
    className="w-64 h-64"
    style={{
      transform: `rotate(${progress * 360}deg)`
    }}
  >
    {/* Outer Ring */}
    <circle
      cx="100"
      cy="100"
      r="90"
      fill="none"
      stroke="rgba(124,124,255,0.6)"
      strokeWidth="2"
      style={{
        filter: `drop-shadow(0 0 ${10 + progress * 20}px rgba(124,124,255,0.8))`
      }}
    />

    {/* Inner Ring */}
    <circle
      cx="100"
      cy="100"
      r="60"
      fill="none"
      stroke="rgba(124,124,255,0.4)"
      strokeWidth="1"
      strokeDasharray="4 6"
    />

    {/* Core Dot */}
    <circle
      cx="100"
      cy="100"
      r="8"
      fill="rgb(124,124,255)"
      style={{
        filter: `drop-shadow(0 0 ${20 + progress * 40}px rgba(124,124,255,1))`
      }}
    />

    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fill="rgb(124,124,255)"
      fontSize="12"
      letterSpacing="3"
    >
      CORE
    </text>
  </svg>
</motion.div>

        {/* Right: Modules */}
        <div className="space-y-6">
          {modules.map((m, i) => (
            <div
              key={i}
              className="flow-module p-4 border border-gray-700 rounded-lg bg-[#0f0f0f]"
            >
              {m}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
