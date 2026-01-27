"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-screen bg-black text-white flex items-center justify-center overflow-hidden">

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.75)_100%)]" />

      {/* Grid Motion */}
      <motion.div
        className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:60px_60px]"
        animate={{ backgroundPosition: ["0px 0px", "120px 120px"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-[5] max-w-4xl text-center px-6"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Detect Fake Media <span className="text-indigo-400">Before It Spreads</span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Upload any video or image. Our system analyzes biological signals, identity drift,
          compression artifacts, and temporal inconsistencies to estimate the probability
          of AI-generated or manipulated media.
        </p>

        <div className="mt-12 flex justify-center gap-6 flex-wrap">
          <button
            onClick={() =>
              document
                .getElementById("media-intake")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 bg-indigo-500 text-black font-semibold rounded-lg hover:bg-indigo-400 transition"
          >
            Upload Media
          </button>

          <button
            onClick={() =>
              document
                .getElementById("pipeline")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 border border-gray-600 text-gray-300 rounded-lg hover:border-white hover:text-white transition"
          >
            See How It Works
          </button>
        </div>

        <div className="mt-10 text-xs tracking-widest text-gray-500">
          FORENSIC ANALYSIS · SIGNAL FUSION · AUTHENTICITY PROBABILITY
        </div>
      </motion.div>

    </section>
  )
}
