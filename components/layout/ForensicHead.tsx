"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, Float, Html, Bounds } from "@react-three/drei"
import { Suspense, useRef, useEffect } from "react"
import * as THREE from "three"

export type ForensicState = {
  rppg: { bpm: number; snr: number }
  identity: { drift: number }
  depth: { valid: boolean; violations: number }
  verdict: "REAL" | "FAKE"
}

function HeadModel({ forensic }: { forensic: ForensicState }) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/head.glb")

  useEffect(() => {
    // Normalize the imported model
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.frustumCulled = false
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!ref.current) return

    const t = state.clock.elapsedTime

    // Subtle forensic motion — not arcade spin
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      Math.sin(t * 0.4) * 0.3,
      0.05
    )

    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      Math.sin(t * 0.2) * 0.1,
      0.05
    )

    // rPPG → subtle breathing pulse
    const pulse =
      1 + Math.sin(t * (forensic.rppg.bpm / 60)) * 0.01

    ref.current.scale.setScalar(pulse)

    // Identity drift → ghost offset
    if (forensic.identity.drift > 7) {
      ref.current.position.x = Math.sin(t * 6) * 0.02
    } else {
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        0,
        0.1
      )
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.05}>
      <group
        ref={ref}
        scale={0.015}           // THIS fixes Sketchfab scale insanity
        position={[0, -0.6, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={scene} />
      </group>
    </Float>
  )
}

export default function ForensicHead({
  forensic
}: {
  forensic: ForensicState
}) {
  return (
    <div className="w-full h-[420px] md:h-[540px] rounded-xl overflow-hidden border border-indigo-500/30 bg-black">
      <Canvas
        camera={{ position: [0, 0, 2.2], fov: 35 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#050505"]} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 3, 5]} intensity={1.5} />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} />

        <Environment preset="warehouse" />

        <Suspense
          fallback={
            <Html center className="text-xs tracking-widest text-indigo-400">
              LOADING FORENSIC MODEL…
            </Html>
          }
        >
          <Bounds fit clip observe>
            <HeadModel forensic={forensic} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/head.glb")
