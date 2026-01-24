"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Vignette / Depth Mask */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.7)_100%)]" />

      {/* Subtle Grid */}
      <motion.div
        className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]"
        animate={{ backgroundPosition: ["0px 0px", "120px 120px"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Foreground Content */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative z-[5] max-w-4xl text-center px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Trust in Media Is Broken.
        </h1>

        <p className="mt-6 text-gray-400 text-lg md:text-xl">
          Multi-Signal Forensic Risk Assessment for Synthetic Media
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:border-white hover:text-white transition">
            Launch Demo
          </button>

          <button className="px-6 py-3 text-gray-500 hover:text-white transition">
            View System
          </button>
        </div>
      </motion.div>

    </section>
  )
}
