import jsPDF from "jspdf"
import type { ForensicReport } from "./types"

/**
 * Force this renderer to only accept a SIGNED report,
 * even if ForensicReport typing drifts elsewhere.
 */
type SignedReport = ForensicReport & {
  integrity: {
    reportHash: string
    signature: {
      algorithm: string
      signature: string
      publicKey: string
      signedAt: string
    }
  }
}

export async function renderPDF(report: SignedReport) {
  const doc = new jsPDF()
  let y = 15

  const { reportHash, signature } = report.integrity

  doc.setFontSize(16)
  doc.text("Forensic Media Integrity Report", 10, y)
  y += 10

  doc.setFontSize(10)
  doc.text(`Session ID: ${report.sessionId}`, 10, y)
  y += 7

  doc.text(`Timestamp: ${report.timestamp}`, 10, y)
  y += 7

  doc.text(`Verdict: ${report.verdict.result}`, 10, y)
  y += 7

  doc.text(
    `System Confidence: ${report.verdict.systemConfidence}%`,
    10,
    y
  )
  y += 7

  doc.text(
    `Probability Real: ${report.verdict.probabilityReal.toFixed(3)}`,
    10,
    y
  )
  y += 12

  doc.text("Risk Drivers:", 10, y)
  y += 6

  report.riskDrivers.forEach((r: string, i: number) => {
    doc.text(`- ${r}`, 12, y + i * 6)
  })

  y += report.riskDrivers.length * 6 + 10

  doc.text("Integrity:", 10, y)
  y += 6

  doc.text("Hash (SHA-256):", 12, y)
  y += 6
  doc.text(reportHash, 12, y, { maxWidth: 180 })
  y += 10

  doc.text(
    `Signature (${signature.algorithm}):`,
    12,
    y
  )
  y += 6

  doc.text(
    signature.signature.slice(0, 64) + "...",
    12,
    y,
    { maxWidth: 180 }
  )

  doc.save(`forensic-report-${report.sessionId}.pdf`)
}
