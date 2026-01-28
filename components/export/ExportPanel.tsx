"use client"

import { motion } from "framer-motion"
import { useForensicSession } from "../system/ForensicSession"
import { getReport } from "../api/forensicClient"

export default function ExportPanel() {
  const { sessionId } = useForensicSession()

  const download = async () => {
    if (!sessionId) {
      alert("No session active")
      return
    }

    const report = await getReport(sessionId)

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    )

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `forensic-${sessionId}.json`
    link.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="flex justify-center py-20"
    >
      <button
        onClick={download}
        className="px-8 py-3 bg-indigo-500 text-black rounded-lg hover:bg-indigo-400 transition"
      >
        Download Forensic Report
      </button>
    </motion.div>
  )
}