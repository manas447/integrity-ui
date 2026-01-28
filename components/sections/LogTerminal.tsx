"use client"

type Props = {
  logs: string[]
}

export default function LogTerminal({ logs }: Props) {
  return (
    <div className="mt-12 border border-gray-800 rounded-lg bg-[#050505] p-4 max-h-[300px] overflow-y-auto font-mono text-xs text-gray-400">
      {logs.length === 0 && (
        <div className="opacity-50">
          Awaiting forensic stream...
        </div>
      )}

      {logs.map((log, i) => (
        <div key={i} className="py-1">
          <span className="text-gray-600 mr-2">
            [{new Date().toLocaleTimeString()}]
          </span>
          {log}
        </div>
      ))}
    </div>
  )
}