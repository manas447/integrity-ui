import Hero from "../components/sections/Hero"
import MediaIntake from "../components/sections/MediaIntake"
import SystemFlow from "../components/sections/SystemFlow"
import SignalDashboard from "../components/sections/SignalDashboard"
import RiskReveal from "../components/sections/RiskReveal"


export default function Home() {
  return (
    <main>
      <Hero />
      <MediaIntake />
      <SystemFlow />
      <SignalDashboard />
      <RiskReveal />
    </main>
  )
}

