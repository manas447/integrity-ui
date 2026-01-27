"use client"

import { useForensicSession } from "../system/ForensicSession"

export default function ExportPanel() {
  const { buildReport } = useForensicSession()

  const downloadJSON = async () => {
    const report = await buildReport()

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    )

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `forensic-session-${report.sessionId}.json`
    link.click()
  }

  const downloadPDF = async () => {
    const report = await buildReport()

    // CLIENT-ONLY LOAD
    const { renderPDF } = await import("./pdfRenderer")

    await renderPDF(report)
  }

  return (
    <div className="flex gap-4 mt-8 justify-center">
      <button
        onClick={downloadJSON}
        className="px-6 py-3 bg-indigo-500 text-black rounded-lg hover:bg-indigo-400 transition"
      >
        Download JSON
      </button>

      <button
        onClick={downloadPDF}
        className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:border-white hover:text-white transition"
      >
        Download PDF
      </button>
    </div>
  )
}
