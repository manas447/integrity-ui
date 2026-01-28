"use client"

import { useEffect, useRef } from "react"

export default function SmoothScroll({
  children
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    let current = 0
    let target = 0

    const ease = 0.08

    const onScroll = () => {
      target = window.scrollY
    }

    const animate = () => {
      current += (target - current) * ease

      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${-current}px)`
      }

      raf = requestAnimationFrame(animate)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="will-change-transform"
      >
        {children}
      </div>

      {/* SCROLL HEIGHT SPACER */}
      <div
        aria-hidden
        className="h-[200vh]"
      />
    </div>
  )
}