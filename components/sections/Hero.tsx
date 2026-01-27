"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Vignette */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.8)_100%)]" />

      {/* Grid Motion */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]"
        animate={{ backgroundPosition: ["0px 0px", "128px 128px"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-[5] max-w-5xl text-center px-6"
      >
        {/* VALUE PROPOSITION */}
        <p className="text-xs tracking-widest text-indigo-400 mb-4">
          FORENSIC MEDIA VERIFICATION · RESULTS IN &lt; 30 SECONDS
        </p>

        <h1
          id="hero-title"
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
        >
          Detect Fake Media{" "}
          <span className="text-indigo-400">
            Before It Spreads
          </span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Upload a video or image to extract biometric signals, identity drift,
          depth consistency, and compression artifacts. Our system fuses
          forensic models into a single authenticity probability you can
          audit and explain.
        </p>

        {/* CTA ROW */}
        <div className="mt-12 flex justify-center gap-6 flex-wrap">
          <button
            aria-label="Upload media for forensic analysis"
            onClick={() =>
              document
                .getElementById("media-intake")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-10 py-4 bg-indigo-500 text-black font-semibold rounded-lg
              hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400
              transition shadow-[0_0_30px_rgba(124,124,255,0.35)]"
          >
            Start Analysis
          </button>

          <button
            aria-label="Learn how the forensic system works"
            onClick={() =>
              document
                .getElementById("pipeline")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 border border-gray-600 text-gray-300 rounded-lg
              hover:border-white hover:text-white
              focus:outline-none focus:ring-2 focus:ring-gray-400
              transition"
          >
            View Forensic Pipeline
          </button>
        </div>

        {/* CREDIBILITY STRIP */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-gray-400 tracking-widest">
          <div className="flex flex-col items-center gap-1">
            <span className="text-indigo-400">rPPG</span>
            <span>Biological Signals</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-indigo-400">MiDaS</span>
            <span>Depth Validation</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-indigo-400">ViT</span>
            <span>Identity Encoding</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-indigo-400">Fusion AI</span>
            <span>Ensemble Scoring</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
