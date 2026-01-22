"use client"

import { useState } from "react"
import Hero from "../components/sections/Hero"
import MediaIntake from "../components/sections/MediaIntake"
import SystemFlow from "../components/sections/SystemFlow"
import SignalDashboard from "../components/sections/SignalDashboard"
import RiskReveal from "../components/sections/RiskReveal"
import Loader from "../components/layout/Loader"
import TextReveal from "../components/sections/TextReveal"
import SignalOrbit from "../components/sections/SignalOrbit"

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <main>
          <Hero />
          <MediaIntake />
          <SystemFlow />
          <SignalOrbit />
          <TextReveal />
          <SignalDashboard />
          <RiskReveal />
        </main>
      )}
    </>
  )
}

