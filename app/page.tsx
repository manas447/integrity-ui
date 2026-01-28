"use client"

import { useEffect } from "react"
import { useSystemBoot } from "../components/system/SystemBoot"
import Loader from "../components/layout/Loader"

import Hero from "../components/sections/Hero"
import MediaIntake from "../components/sections/MediaIntake"
import SystemFlow from "../components/sections/SystemFlow"
import RiskReveal from "../components/sections/RiskReveal"
import ExportPanel from "../components/export/ExportPanel"

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
        <SystemFlow />
        <RiskReveal />
        <ExportPanel />
      </main>
    </>
  )
}