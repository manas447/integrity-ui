import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import SmoothScroll from "../components/layout/SmoothScroll"
import Noise from "../components/layout/Noise"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Integrity UI",
  description: "Forensic Interface for Synthetic Media Risk Analysis"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Energy Field */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_30%,rgba(124,124,255,0.06),transparent_60%)]" />

        {/* System Noise Overlay */}
        <Noise />

        {/* Camera / Scroll System */}
        <SmoothScroll>
  <div className="animate-fade-in">
    {children}
  </div>
</SmoothScroll>

      </body>
    </html>
  )
}
