"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { useSystemBoot } from "../system/SystemBoot"

export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const { isSystemReady, progress, statusLine } = useSystemBoot()

  useEffect(() => {
    if (!rootRef.current || !barRef.current) return

    const q = gsap.utils.selector(rootRef)
    const letters = q(".loader-letter")
    const box = q(".loader-box")
    const grow = q(".growing-image")

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      paused: true
    })

    tl.from(letters, {
      yPercent: 100,
      stagger: 0.05,
      duration: 1.2
    })

    tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1.2 }, "<")
    tl.fromTo(grow, { width: "0%" }, { width: "100%", duration: 1.2 }, "<")

    tl.to(rootRef.current, {
      opacity: 0,
      pointerEvents: "none",
      duration: 1.4
    })

    tlRef.current = tl
  }, [])

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${progress}%`
    }

    if (isSystemReady && tlRef.current) {
      tlRef.current.play()
    }
  }, [isSystemReady, progress])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-10"
    >
      {/* LOGO */}
      <div className="flex items-center text-[6rem] md:text-[8rem] font-bold text-white">
        <div className="flex overflow-hidden">
          {"INT".split("").map((l, i) => (
            <span key={i} className="loader-letter block">
              {l}
            </span>
          ))}
        </div>

        <div className="loader-box relative mx-2 h-[8rem] w-0 overflow-hidden">
          <div className="growing-image absolute inset-0 bg-[url('/loader.jpg')] bg-cover bg-center" />
        </div>

        <div className="flex overflow-hidden">
          {"EGRITY".split("").map((l, i) => (
            <span key={i} className="loader-letter block">
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* SYSTEM STATUS */}
      <div className="w-[320px] space-y-3 text-center">
        <div className="text-xs tracking-widest text-indigo-400">
          {statusLine.toUpperCase()}
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-indigo-500 transition-all duration-500"
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
