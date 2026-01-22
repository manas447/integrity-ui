"use client"

export default function SignalOrbit() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-10">
      <div className="orbit-container">

        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Background Oval */}
          <path
            className="orbit-oval"
            d="M 15,15
               H 85
               Q 99,15 99,30
               V 70
               Q 100,85 85,85
               H 15
               Q 1,85 0,70
               V 30
               Q 1,15 15,15
               Z"
          />

          {/* Moving Energy Line */}
          <path
            className="orbit-line"
            d="M 15,15
               H 85
               Q 99,15 99,30
               V 70
               Q 100,85 85,85
               H 15
               Q 1,85 0,70
               V 30
               Q 1,15 15,15
               Z"
          />
        </svg>

        {/* Nodes */}
        <div className="orbit-node security">SECURITY</div>
        <div className="orbit-node heart">BIOMETRIC</div>
        <div className="orbit-node battery">ENERGY</div>
        <div className="orbit-node parcel">DATA</div>
        <div className="orbit-node notes">LOGS</div>
        <div className="orbit-node scooter">FLOW</div>

      </div>
    </section>
  )
}
