import jsPDF from "jspdf"
import type { ForensicReport } from "../api/types"

export async function renderPDF(
  report: ForensicReport
) {
  const doc = new jsPDF()
  let y = 15

  // HEADER
  doc.setFontSize(16)
  doc.text("Forensic Media Integrity Report", 10, y)
  y += 10

  // META
  doc.setFontSize(10)
  doc.text(`Session ID: ${report.sessionId}`, 10, y)
  y += 6

  doc.text(`Timestamp: ${report.timestamp}`, 10, y)
  y += 10

  // VERDICT
  doc.setFontSize(12)
  doc.text("Verdict", 10, y)
  y += 6

  doc.setFontSize(10)
  doc.text(`Result: ${report.verdict.result}`, 12, y)
  y += 6

  doc.text(
    `System Confidence: ${report.verdict.systemConfidence}%`,
    12,
    y
  )
  y += 6

  doc.text(
    `Probability Real: ${report.verdict.probabilityReal}`,
    12,
    y
  )
  y += 10

  // TIER 0
  doc.setFontSize(12)
  doc.text("Tier-0 Capture Metrics", 10, y)
  y += 6

  doc.setFontSize(10)
  doc.text(
    `Likelihood: ${report.tier0.captureLikelihood}`,
    12,
    y
  )
  y += 6

  doc.text(
    `Survivability: ${report.tier0.survivability}`,
    12,
    y
  )
  y += 6

  doc.text(
    `Derived: ${report.tier0.derived}`,
    12,
    y
  )
  y += 6

  doc.text(
    `Notes: ${report.tier0.notes}`,
    12,
    y
  )
  y += 10

  // RISK DRIVERS
  doc.setFontSize(12)
  doc.text("Primary Risk Drivers", 10, y)
  y += 6

  doc.setFontSize(10)
  report.riskDrivers.forEach(risk => {
    doc.text(`- ${risk}`, 12, y)
    y += 6
  })

  y += 8

  // SYSTEM
  doc.setFontSize(12)
  doc.text("System Information", 10, y)
  y += 6

  doc.setFontSize(10)
  doc.text(`Version: ${report.system.version}`, 12, y)
  y += 6

  doc.text(
    `Environment: ${report.system.environment}`,
    12,
    y
  )
  y += 6

  doc.text(
    `Models: ${report.system.modelStack.join(", ")}`,
    12,
    y
  )

  // SAVE
  doc.save(
    `forensic-report-${report.sessionId}.pdf`
  )
}