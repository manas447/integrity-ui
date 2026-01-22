"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

const lines = [
  { main: "Cordial Motion", reveal: "Breaking" },
  { main: "The", reveal: "Barriers" },
  { main: "Sign Language", reveal: "Between" },
  { main: "Interpreter", reveal: "Human & AI" },
  { main: "TRUST", reveal: "IN MEDIA" }
]

export default function TextReveal() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const { ScrollTrigger } = require("gsap/ScrollTrigger")
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".reveal-text")

      elements.forEach((el) => {
        gsap.to(el, {
          backgroundSize: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "center 80%",
            end: "center 20%",
            scrub: true
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="min-h-screen bg-black flex items-center px-16"
    >
      <div className="w-full space-y-10">
        {lines.map((line, i) => (
          <h1
            key={i}
            className="reveal-text relative text-[8vw] leading-[1] font-semibold tracking-tight text-[rgba(182,182,182,0.2)]
              bg-gradient-to-r from-[rgb(124,124,255)] to-[rgb(124,124,255)]
              bg-no-repeat bg-left bg-[length:0%_100%]
              transition-[background-size] duration-500
              border-b border-gray-800 pb-6 overflow-hidden"
          >
            {line.main}

            <span
              className="absolute inset-0 flex items-center justify-start px-2
                bg-[rgb(124,124,255)] text-black
                clip-hidden"
            >
              {line.reveal}
            </span>
          </h1>
        ))}
      </div>
    </section>
  )
}
