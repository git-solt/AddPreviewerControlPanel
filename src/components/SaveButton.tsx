import { useState } from 'react'
import { AdConfig } from './ConfigForm'

interface SaveButtonProps {
  config: AdConfig
  onSaveSuccess?: (id: string) => void
}

export function SaveButton({ config, onSaveSuccess }: SaveButtonProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!config.heading.trim()) {
      setStatus('error')
      setMessage('Overskrift er påkrevd')
      return
    }

    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('http://localhost:3001/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStatus('success')
      setMessage(`Utkast lagret med ID: ${data.id}`)
      onSaveSuccess?.(data.id)

      // Clear message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? `Feil: ${error.message}`
          : 'Feil ved lagring av utkast'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="save-button-container">
      <button
        onClick={handleSave}
        disabled={loading}
        className="save-button"
      >
        {loading ? 'Lagrer...' : 'Lagre utkast'}
      </button>
      {status === 'success' && (
        <div className="save-status success">{message}</div>
      )}
      {status === 'error' && (
        <div className="save-status error">{message}</div>
      )}
    </div>
  )
}
