"use client"

import { useEffect, useState } from "react"
import { hudStore, HUDState } from "./hudStore"

export function useHUD(): HUDState {
  const [state, setState] = useState<HUDState>(hudStore.get())

  useEffect(() => {
    return hudStore.subscribe(() => {
      setState(hudStore.get())
    })
  }, [])

  return state
}