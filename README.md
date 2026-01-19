# Integrity UI — Forensic Media Verification System

An interactive, scroll-driven frontend that simulates a multi-signal AI pipeline for detecting synthetic and manipulated media. Built to demonstrate explainable AI, human-in-the-loop escalation, and forensic signal fusion in a cinematic, system-style interface.

## Live Demo
> https://integrity-ui.vercel.app  
(Deploy on Vercel for public access)

---

## Problem
Trust in digital media is eroding due to the rise of deepfakes and synthetic content. Most detection tools provide a binary result without explaining *why* a piece of media is flagged.

## Solution
Integrity UI visualizes media verification as a **multi-stage forensic system**:
- Media Intake & Processing
- Multi-Signal Analysis Pipeline
- Explainable Signal Breakdown
- Risk Scoring & Human Review Escalation

The goal is not just classification — but **transparent decision support**.

---

## System Architecture

User Input (Image/Video)
│
▼
Media Intake Layer
(Upload + Analysis Simulation)
│
▼
System Flow Engine
(Scroll-Driven AI Core + Modules)
│
▼
Signal Dashboard
(Weighted Forensic Signals)
│
▼
Risk Score Engine
(Threshold Logic)
│
▼
Human Review Escalation


---

## Tech Stack
- **Next.js 16 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — UI motion & state transitions
- **GSAP + ScrollTrigger** — scroll-driven system logic
- **Lenis** — smooth scrolling
- **Vercel** — deployment

---

## Key Features
- Scroll-driven AI pipeline visualization
- Explainable forensic signal dashboard
- Deterministic demo mode for live presentations
- Human-in-the-loop escalation logic
- Fully responsive, system-style UI

---

## Demo Mode
To ensure stable results during presentations, the system supports deterministic output.
Edit:
lib/demo.ts

cpp
Copy code
Toggle:
```ts
export const DEMO_MODE = true
Local Development
bash
Copy code
pnpm install
pnpm devOpen:
http://localhost:3000

Future Work

Backend API for real deepfake detection models

Model ensemble integration (CNN + Vision Transformer)

Evidence heatmaps on facial landmarks

Dataset-based confidence calibration



