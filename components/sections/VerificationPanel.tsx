"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { ForensicReport, SignatureBlock } from "../export/types"

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

function hexToArrayBuffer(hex: string): ArrayBuffer {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error("Invalid signature encoding")
  }

  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map(b => parseInt(b, 16))
  )

  return bytes.buffer
}

/* ======================
   COMPONENT
====================== */

type VerifyState =
  | "IDLE"
  | "VALID"
  | "TAMPERED"
  | "INVALID"

export default function VerificationPanel() {
  const [state, setState] = useState<VerifyState>("IDLE")
  const [message, setMessage] = useState(
    "Upload a signed forensic report JSON to verify its integrity."
  )

  const verifyReport = async (file: File) => {
    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as ForensicReport

      if (
        !parsed.integrity ||
        !parsed.integrity.signature
      ) {
        throw new Error("Missing integrity block")
      }

      const { reportHash, signature } =
        parsed.integrity

      const sig = signature as SignatureBlock

      if (!sig.publicKey || !sig.signature) {
        throw new Error(
          "Malformed signature block"
        )
      }

      // Clone report WITHOUT integrity
      const { integrity, ...unsigned } = parsed

      const recomputedHash = await sha256(
        JSON.stringify(unsigned)
      )

      if (recomputedHash !== reportHash) {
        setState("TAMPERED")
        setMessage(
          "Hash mismatch. Report content has been modified."
        )
        return
      }

      // Import public key
      const key = await crypto.subtle.importKey(
        "jwk",
        JSON.parse(sig.publicKey),
        {
          name: "ECDSA",
          namedCurve: "P-256"
        },
        true,
        ["verify"]
      )

      const valid = await crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" },
        key,
        hexToArrayBuffer(sig.signature),
        new TextEncoder().encode(reportHash)
      )

      if (!valid) {
        setState("INVALID")
        setMessage(
          "Signature verification failed. Public key mismatch or forged report."
        )
        return
      }

      setState("VALID")
      setMessage(
        "Signature valid. Report integrity verified successfully."
      )
    } catch (err) {
      setState("INVALID")
      setMessage(
        err instanceof Error
          ? err.message
          : "Verification failed"
      )
    }
  }

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Forensic Report Verification
      </motion.h2>

      <div className="w-full max-w-xl border border-gray-800 rounded-xl bg-[#050505] p-8 text-center space-y-6">
        <p className="text-gray-400 text-sm">
          Upload a signed forensic JSON report to validate its cryptographic
          integrity and detect tampering.
        </p>

        <input
          type="file"
          accept="application/json"
          className="hidden"
          id="verify-upload"
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) verifyReport(file)
          }}
        />

        <label
          htmlFor="verify-upload"
          className="inline-block px-8 py-3 bg-indigo-500 text-black rounded-lg cursor-pointer hover:bg-indigo-400 transition"
        >
          Upload Report
        </label>

        <div
          className={`mt-6 p-4 rounded border text-sm tracking-widest ${
            state === "VALID"
              ? "border-green-500/40 text-green-400 bg-green-500/10"
              : state === "TAMPERED"
              ? "border-yellow-500/40 text-yellow-400 bg-yellow-500/10"
              : state === "INVALID"
              ? "border-red-500/40 text-red-400 bg-red-500/10"
              : "border-gray-700 text-gray-400"
          }`}
        >
          {message}
        </div>
      </div>
    </section>
  )
}
