"use client"

import { motion } from "framer-motion"

export default function Noise() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 bg-[url('/noise.png')] opacity-[0.035]"
      animate={{ opacity: [0.02, 0.045, 0.02] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  )
}
