"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, Float, Html } from "@react-three/drei"
import { Suspense, useEffect, useRef } from "react"
import * as THREE from "three"
import { useSystemBoot } from "../system/SystemBoot"

export type ForensicState = {
  rppg: { bpm: number; snr: number }
  identity: { drift: number }
  depth: { valid: boolean; violations: number }
  verdict: "REAL" | "FAKE"
}

const SAFE_FORENSIC: ForensicState = {
  rppg: { bpm: 70, snr: 1.5 },
  identity: { drift: 0 },
  depth: { valid: true, violations: 0 },
  verdict: "REAL"
}

function HeadModel({
  forensic,
  onReady
}: {
  forensic: ForensicState
  onReady: () => void
}) {
  const ref = useRef<THREE.Group>(null)
  const { scene } = useGLTF("/models/head.glb")

  useEffect(() => {
    scene.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        obj.material.roughness = 0.6
        obj.material.metalness = 0.05
        obj.material.needsUpdate = true
      }
    })

    onReady()
  }, [scene, onReady])

  useFrame((state) => {
    if (!ref.current) return

    const t = state.clock.elapsedTime
    const f = forensic || SAFE_FORENSIC

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      Math.sin(t * 0.4) * 0.25,
      0.05
    )

    const pulse = 1 + Math.sin(t * (f.rppg.bpm / 60)) * 0.01
    ref.current.scale.setScalar(0.015 * pulse)

    if (f.identity.drift > 6) {
      ref.current.position.x = Math.sin(t * 6) * 0.03
    } else {
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        0,
        0.1
      )
    }
  })

  return (
    <Float speed={0.4} rotationIntensity={0.04} floatIntensity={0.04}>
      <group
        ref={ref}
        scale={0.015}
        position={[0, -0.6, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={scene} />
      </group>
    </Float>
  )
}

export default function ForensicHead({
  forensic = SAFE_FORENSIC
}: {
  forensic?: ForensicState
}) {
  const { markReady } = useSystemBoot()

useEffect(() => {
  markReady("gltf")
}, [markReady])


  return (
    <div className="w-full h-[420px] md:h-[540px] rounded-xl overflow-hidden border border-indigo-500/30 bg-black">
      <Canvas camera={{ position: [0, 0, 2.3], fov: 35 }}>
        <color attach="background" args={["#050505"]} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 4, 6]} intensity={1.4} />

        <Environment preset="warehouse" />

        <Suspense
          fallback={
            <Html center className="text-xs tracking-widest text-indigo-400">
              LOADING FORENSIC MODEL…
            </Html>
          }
        >
          <HeadModel
            forensic={forensic}
            onReady={() => markReady("gltf")}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/head.glb")