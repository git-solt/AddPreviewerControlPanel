import { useState, useCallback } from 'react'
import { ConfigForm, type AdConfig } from './components/ConfigForm'
import { PreviewFrame } from './components/PreviewFrame'
import { EventLog, type LogEvent } from './components/EventLog'
import './App.css'

const DEFAULT_CONFIG: AdConfig = {
  heading: '',
  body: '',
  ctaText: '',
  theme: 'blue',
  imageUrl: '',
}

export default function App() {
  const [config, setConfig] = useState<AdConfig>(DEFAULT_CONFIG)
  const [logs, setLogs] = useState<LogEvent[]>([])

  const addLog = useCallback((direction: 'sent' | 'received', type: string, data: unknown) => {
    const event: LogEvent = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      direction,
      type,
      data,
    }
    setLogs((prev) => {
      const updated = [...prev, event]
      // Keep only last 100 events
      return updated.slice(-100)
    })
  }, [])

  const handleMessageSent = useCallback((message: unknown) => {
    if (typeof message === 'object' && message !== null && 'type' in message) {
      const { type, payload } = message as { type: string; payload?: unknown }
      addLog('sent', type, payload)
    }
  }, [addLog])

  const handleMessageReceived = useCallback((message: unknown) => {
    if (typeof message === 'object' && message !== null && 'type' in message) {
      const { type, data } = message as { type: string; data?: unknown }
      addLog('received', type, data)
    }
  }, [addLog])

  return (
    <div className="dashboard">
      <div className="left-column">
        <ConfigForm config={config} onChange={setConfig} />
        <EventLog events={logs} />
      </div>
      <PreviewFrame
        config={config}
        onMessageSent={handleMessageSent}
        onMessageReceived={handleMessageReceived}
      />
    </div>
  )
}
