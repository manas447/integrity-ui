 "use client"

import { useEffect } from "react"
import { useSystemBoot } from "../components/system/SystemBoot"
import Loader from "../components/layout/Loader"
import DriftTimeline from "../components/sections/DriftTimeline"

import Hero from "../components/sections/Hero"
import MediaIntake from "../components/sections/MediaIntake"
import EvidencePipeline from "../components/sections/EvidencePipeline"
import SystemFlow from "../components/sections/SystemFlow"
import SignalDashboard from "../components/sections/SignalDashboard"
import RiskReveal from "../components/sections/RiskReveal"

export default function Home() {
  const { markReady } = useSystemBoot()

  useEffect(() => {
    markReady("ui")
  }, [markReady])

  return (
    <>
      <Loader />

      <main>
        <Hero />
        <MediaIntake />
        <EvidencePipeline />
        <SystemFlow />
        <DriftTimeline />
        <SignalDashboard />
        <RiskReveal />
      </main>
    </>
  )
}
