import { useEffect, useRef } from 'react'
import { AdConfig } from './ConfigForm'

interface PreviewFrameProps {
  config: AdConfig
}

export function PreviewFrame({ config }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'AD_CONFIG_UPDATE', payload: config },
        '*'
      )
    }
  }, [config])

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
