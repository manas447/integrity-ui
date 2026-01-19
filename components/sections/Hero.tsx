"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-4xl text-center px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          Trust in Media Is Broken.
        </h1>

        <p className="mt-6 text-gray-400 text-lg md:text-xl">
          Multi-Signal Forensic Risk Assessment for Synthetic Media
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:opacity-80 transition">
            Launch Demo
          </button>
          <button className="px-6 py-3 border border-gray-600 rounded-lg hover:border-white transition">
            View System
          </button>
        </div>
      </motion.div>
    </section>
  )
}
