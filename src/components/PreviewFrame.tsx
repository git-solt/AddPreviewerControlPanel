import { useEffect, useRef } from 'react'
import { AdConfig } from './ConfigForm'

interface PreviewFrameProps {
  config: AdConfig
  onMessageSent?: (message: unknown) => void
  onMessageReceived?: (message: unknown) => void
}

export function PreviewFrame({ config, onMessageSent, onMessageReceived }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const message = { type: 'AD_CONFIG_UPDATE', payload: config }
      iframeRef.current.contentWindow.postMessage(message, '*')
      onMessageSent?.(message)
    }
  }, [config, onMessageSent])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AD_CONFIG_ACK') {
        onMessageReceived?.(event.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onMessageReceived])

  return (
    <div className="preview-panel">
      <h2>Forhåndsvisning</h2>
      <iframe
        ref={iframeRef}
        src="/preview.html"
        title="Ad Preview"
        className="preview-frame"
      />
    </div>
  )
}
