"use client"


import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import gsap from "gsap"

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
const [scanned, setScanned] = useState(false)

useEffect(() => {
  if (typeof window === "undefined") return

  // Dynamically load ScrollTrigger to avoid SSR / Vercel issues
  const { ScrollTrigger } = require("gsap/ScrollTrigger")
  gsap.registerPlugin(ScrollTrigger)

  let last = 0

  const ctx = gsap.context(() => {
    // Module reveal animation
    gsap.from(".flow-module", {
      opacity: 0,
      y: 40,
      stagger: 0.3,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1.5
      }
    })

    // Progress driver (throttled to avoid 60fps React re-renders)
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
      onUpdate: (self: any) => {
        const p = self.progress
        if (Math.abs(p - last) > 0.02) {
          last = p
          setProgress(p)
        }
      }
    })
  }, containerRef)

  return () => {
    ScrollTrigger.getAll().forEach((t: any) => t.kill())
    ctx.revert()
  }
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
      transform: `rotate(${progress * 180}deg) scale(${1 + Math.sin(progress * 6) * 0.05})`
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

    <foreignObject x="0" y="0" width="200" height="200">
  <div className="w-full h-full flex items-center justify-center">
    <span className="text-[10px] tracking-[0.3em] text-[rgb(124,124,255)]">
      CORE
    </span>
  </div>
</foreignObject>

  </svg>
</motion.div>

{/* Right: Modules */}
<div className="relative">
  {progress > 0.45 && !scanned && (

  <motion.div

    className="absolute -left-4 top-0 h-full w-1 bg-gradient-to-b from-transparent via-[rgba(124,124,255,0.4)] to-transparent"
    initial={{ y: "-100%" }}
    animate={{ y: "100%" }}
    transition={{
      duration: 2.5,
      ease: "easeInOut",
      onAnimationComplete: () => setScanned(true)
    }}
  />
)}


<div className="relative space-y-6">
  {/* Signal Tether Line (UPGRADE #1) */}
  <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

{modules.map((m, i) => (
  <div
    key={i}
    className="flow-module relative p-4 border border-gray-700 rounded-lg bg-[#0f0f0f] transition-all"
    style={{
      willChange: "transform, box-shadow"
    }}
  >
    {/* Module Name */}
    <span className="block">{m}</span>

    {/* Live Progress Indicator */}
    <span className="absolute right-3 top-3 text-[10px] tracking-widest text-gray-500">
      {Math.round(progress * 100)}%
    </span>
  </div>
))}

</div>

</div>
      </div>
    </section>
  )
}
