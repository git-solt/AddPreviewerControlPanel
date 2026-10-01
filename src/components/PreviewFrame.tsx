import { useEffect, useRef, useState } from 'react'
import { AdConfig } from './ConfigForm'

interface PreviewFrameProps {
  config: AdConfig
  onMessageSent?: (message: unknown) => void
  onMessageReceived?: (message: unknown) => void
}

export function PreviewFrame({ config, onMessageSent, onMessageReceived }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isIframeReady, setIsIframeReady] = useState(false)

  // 1. Lytt til meldinger FRA iFramen (både handshaken og svar som ACK)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Sikkerhetssjekk på opphav (origin)
      if (event.origin !== window.location.origin && event.origin !== 'null') {
        console.warn(`[Security] Message blocked from untrusted origin: ${event.origin}`)
        return
      }

      // Handshake: iFramen melder at skriptet og lytteren der inne er ferdig opprettet
      if (event.data?.type === 'PREVIEW_READY') {
        setIsIframeReady(true)
      }

      // Bekreftelse fra iFramen på at config ble tatt imot/oppdatert
      if (event.data?.type === 'AD_CONFIG_ACK') {
        onMessageReceived?.(event.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onMessageReceived])

  // 2. Send ny config TIL iFramen (kun når iFramen har meldt seg klar, eller config endres)
  useEffect(() => {
    if (!isIframeReady || !iframeRef.current?.contentWindow) return

    const message = { type: 'AD_CONFIG_UPDATE', payload: config }
    iframeRef.current.contentWindow.postMessage(message, '*')
    
    // Varsle foreldrekomponenten om at melding er sendt
    onMessageSent?.(message)
  }, [config, isIframeReady, onMessageSent])

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