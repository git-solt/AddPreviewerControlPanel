import { useState } from 'react'
import { ConfigForm, type AdConfig } from './components/ConfigForm'
import { PreviewFrame } from './components/PreviewFrame'
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

  return (
    <div className="dashboard">
      <ConfigForm config={config} onChange={setConfig} />
      <PreviewFrame config={config} />
    </div>
  )
}
