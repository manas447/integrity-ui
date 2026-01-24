"use client"

import { useState, type ReactNode } from "react"

import Hero from "../components/sections/Hero"
import EvidencePipeline from "../components/sections/EvidencePipeline"
import MediaIntake from "../components/sections/MediaIntake"
import SystemFlow from "../components/sections/SystemFlow"
import SignalDashboard from "../components/sections/SignalDashboard"
import RiskReveal from "../components/sections/RiskReveal"
import Loader from "../components/layout/Loader"

function Stage({ children }: { children: ReactNode }) {
  return (
    <section className="w-full flex justify-center py-24">
      <div className="w-full max-w-7xl px-8">
        {children}
      </div>
    </section>
  )
}

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <main className="bg-black text-white overflow-x-hidden">

          {/* INTRO */}
          <Stage>
            <Hero />
          </Stage>

          {/* PIPELINE VISUAL */}
          <Stage>
            <EvidencePipeline />
          </Stage>

          {/* USER ACTION */}
          <Stage>
            <MediaIntake />
          </Stage>

          {/* LIVE SIGNAL EXTRACTION */}
          <Stage>
            <SystemFlow />
          </Stage>

          {/* MODEL FUSION */}
          <Stage>
            <SignalDashboard />
          </Stage>

          {/* FINAL VERDICT */}
          <Stage>
            <RiskReveal />
          </Stage>

        </main>
      )}
    </>
  )
}
