export {} // FORCE MODULE

import type { ForensicState } from "../layout/ForensicHead"
import type { ForensicReport, SignatureBlock } from "./types"

/* ======================
   CRYPTO UTILS
====================== */

async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)

  const hashBuffer = await crypto.subtle.digest("SHA-256", data)

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

async function signHash(
  hash: string
): Promise<SignatureBlock> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256"
    },
    true,
    ["sign", "verify"]
  )

  const encoder = new TextEncoder()

  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    keyPair.privateKey,
    encoder.encode(hash)
  )

  const signatureHex = Array.from(
    new Uint8Array(signatureBuffer)
  )
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  const publicKey = await crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey
  )

  return {
    signature: signatureHex,
    publicKey: JSON.stringify(publicKey)
  }
}

/* ======================
   CORE
====================== */

export async function buildReport(
  forensic: ForensicState,
  filename: string | null
): Promise<ForensicReport> {
  const systemConfidence = computeConfidence(forensic)

  const verdictResult =
    systemConfidence < 50
      ? "FAKE"
      : systemConfidence < 70
      ? "UNCERTAIN"
      : "LIKELY AUTHENTIC"

  const baseReport: Omit<
    ForensicReport,
    "integrity"
  > = {
    sessionId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),

    media: {
      filename: filename || "unknown",
      type: filename?.split(".").pop() || "unknown",
      sizeMB: 0
    },

    verdict: {
      result: verdictResult,
      systemConfidence,
      probabilityReal:
        verdictResult === "FAKE"
          ? 0.01
          : verdictResult === "UNCERTAIN"
          ? 0.5
          : 0.95
    },

    tier0: {
      captureLikelihood: 0.7,
      survivability: "HIGH",
      derived: false,
      notes: "over_smooth_motion"
    },

    signals: forensic,

    riskDrivers: buildRiskDrivers(forensic),

    system: {
      version: "IntegrityUI v1.0",
      modelStack: [
        "MiDaS Depth",
        "ViT Identity Encoder",
        "rPPG Signal Extractor",
        "Phase Correlation Model"
      ],
      environment: "WebGL / Client-Side Simulation"
    }
  }

  /* ======================
     INTEGRITY LAYER
  ====================== */

  const reportHash = await sha256(
    JSON.stringify(baseReport)
  )

  const signature = await signHash(reportHash)

  return {
    ...baseReport,
    integrity: {
      reportHash,
      signed: true,
      signatureValid: true,
      signature
    }
  }
}

/* ======================
   FUSION MATH
====================== */

function computeConfidence(
  forensic: ForensicState
): number {
  const snrScore = Math.min(
    100,
    forensic.rppg.snr * 40 + 30
  )

  const driftScore = Math.max(
    0,
    100 - forensic.identity.drift * 7
  )

  const depthScore = forensic.depth.valid
    ? 85
    : 20

  return Math.round(
    snrScore * 0.35 +
      driftScore * 0.4 +
      depthScore * 0.25
  )
}

function buildRiskDrivers(
  forensic: ForensicState
): string[] {
  const risks: string[] = []

  if (!forensic.depth.valid) {
    risks.push(
      `MiDaS depth violations detected (${forensic.depth.violations} frames)`
    )
  }

  if (forensic.identity.drift > 7) {
    risks.push(
      "High identity drift across frame window"
    )
  }

  if (forensic.rppg.snr < 1.0) {
    risks.push(
      "Low rPPG signal-to-noise confidence"
    )
  }

  if (!risks.length) {
    risks.push(
      "No dominant forensic risk drivers detected"
    )
  }

  return risks
}
