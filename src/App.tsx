import { useState, useEffect, useRef } from 'react'
import './App.css'

interface AdConfig {
  heading: string
}

export default function App() {
  const [config, setConfig] = useState<AdConfig>({ heading: '' })
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfig = { ...config, heading: e.target.value }
    setConfig(newConfig)
    sendToIframe(newConfig)
  }

  const sendToIframe = (updatedConfig: AdConfig) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'AD_CONFIG_UPDATE', payload: updatedConfig },
        '*'
      )
    }
  }

  useEffect(() => {
    if (iframeRef.current) {
      sendToIframe(config)
    }
  }, [])

  return (
    <div className="dashboard">
      <div className="config-panel">
        <h1>Annonse Konfigurasjon</h1>
        <div className="form-group">
          <label htmlFor="heading">Overskrift</label>
          <input
            id="heading"
            type="text"
            placeholder="Skriv overskriften din her..."
            value={config.heading}
            onChange={handleHeadingChange}
          />
        </div>
      </div>

      <div className="preview-panel">
        <h2>Forhåndsvisning</h2>
        <iframe
          ref={iframeRef}
          src="/preview.html"
          title="Ad Preview"
          className="preview-frame"
        />
      </div>
    </div>
  )
}
