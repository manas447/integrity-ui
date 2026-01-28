"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

/* ======================
   LOADING PHASES
====================== */

const PHASES = [
  { label: "Booting Interface", duration: 800 },
  { label: "Initializing UI Shell", duration: 1000 },
  { label: "Loading Typography System", duration: 1200 },
  { label: "Mounting Visualization Engine", duration: 1200 },
  { label: "Finalizing Session", duration: 800 }
]

/* ======================
   PROPS
====================== */

type LoaderProps = {
  onComplete?: () => void
}

/* ======================
   COMPONENT
====================== */

export default function Loader({ onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState(PHASES[0].label)
  const [progress, setProgress] = useState(0)

  /* ======================
     MAIN LOOP
  ====================== */

  useEffect(() => {
    let current = 0
    let elapsed = 0
    let progressValue = 0

    const totalTime = PHASES.reduce(
      (sum, phase) => sum + phase.duration,
      0
    )

    let rafId: number

    const finish = () => {
      if (!rootRef.current) return

      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        pointerEvents: "none",
        onComplete
      })
    }

    const tick = () => {
      const phase = PHASES[current]

      // Safety guard — never crash on bad index
      if (!phase) {
        finish()
        return
      }

      elapsed += 16
      progressValue += (100 / totalTime) * 16

      const pct = Math.min(100, Math.round(progressValue))
      setProgress(pct)

      if (barRef.current) {
        barRef.current.style.width = `${pct}%`
      }

      if (elapsed >= phase.duration) {
        elapsed = 0
        current++

        if (PHASES[current]) {
          setStatus(PHASES[current].label)
        }
      }

      if (pct >= 100) {
        finish()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [onComplete])

  /* ======================
     RENDER
  ====================== */

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-10"
    >
      {/* LOGO */}
      <div className="flex items-center text-[5rem] md:text-[7rem] font-bold text-white tracking-widest">
        <span className="text-indigo-400">INT</span>
        <span className="mx-2">EGRITY</span>
      </div>

      {/* STATUS */}
      <div className="w-[320px] space-y-4 text-center">
        <div className="text-xs tracking-widest text-indigo-400 uppercase">
          {status}
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-indigo-500 transition-all duration-200"
            style={{ width: "0%" }}
          />
        </div>

        <div className="text-xs text-gray-400 tracking-widest">
          {progress}% COMPLETE
        </div>
      </div>
    </div>
  )
}