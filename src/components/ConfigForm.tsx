import { useCallback, useEffect, useState } from 'react'
import { SaveButton } from './SaveButton'

export interface AdConfig {
  heading: string
  body: string
  ctaText: string
  theme: 'blue' | 'red' | 'green' | 'dark'
  imageUrl: string
  adLabel: 'ad' | 'sponsored' | 'advertiser'
}

interface ConfigFormProps {
  config: AdConfig
  onChange: (config: AdConfig) => void
}

interface SavedAd extends AdConfig {
  id: string
  createdAt: string
}

const THEME_COLORS: Record<AdConfig['theme'], string> = {
  blue: '#0066cc',
  red: '#cc0000',
  green: '#00aa00',
  dark: '#333',
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  const [savedAds, setSavedAds] = useState<SavedAd[]>([])
  const [loadError, setLoadError] = useState(false)

  const loadSavedAds = useCallback(async () => {
    try {
      const response = await fetch('/api/ads')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      setSavedAds(await response.json())
      setLoadError(false)
    } catch {
      setLoadError(true)
    }
  }, [])

  useEffect(() => {
    loadSavedAds()
  }, [loadSavedAds])

  const handleChange = (field: keyof AdConfig, value: string) => {
    const updated = { ...config, [field]: value }
    onChange(updated)
  }

  return (
    <div className="config-panel">
      <div className="config-header">
        <h1>Annonse Konfigurasjon</h1>

        <details
          className="saved-ads"
          onToggle={(e) => {
            if (e.currentTarget.open) loadSavedAds()
          }}
        >
          <summary>Mine lagrede utkast ({savedAds.length})</summary>
          <div className="saved-ads-menu">
            {loadError ? (
              <p className="saved-ads-empty">Kunne ikke hente lagrede utkast</p>
            ) : savedAds.length === 0 ? (
              <p className="saved-ads-empty">Ingen lagrede utkast ennå</p>
            ) : (
              <ul>
                {savedAds.map((ad) => (
                  <li key={ad.id}>
                    <span
                      className="theme-dot"
                      style={{ backgroundColor: THEME_COLORS[ad.theme] }}
                      title={ad.theme}
                    />
                    <span className="saved-ad-heading">{ad.heading}</span>
                    <span className="saved-ad-time">
                      {new Date(ad.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>

      <div className="form-group">
        <label htmlFor="heading">Overskrift</label>
        <input
          id="heading"
          type="text"
          placeholder="Skriv overskriften din her..."
          value={config.heading}
          onChange={(e) => handleChange('heading', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="body">Brødtekst</label>
        <textarea
          id="body"
          placeholder="Skriv brødteksten her..."
          value={config.body}
          onChange={(e) => handleChange('body', e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ctaText">Knappetekst (CTA)</label>
          <input
            id="ctaText"
            type="text"
            placeholder="F.eks. 'Les mer'"
            value={config.ctaText}
            onChange={(e) => handleChange('ctaText', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="theme">Tema</label>
          <select
            id="theme"
            value={config.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="blue">Blå</option>
            <option value="red">Rød</option>
            <option value="green">Grønn</option>
            <option value="dark">Mørk</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="adLabel">Merkelapp</label>
        <select
          id="adLabel"
          value={config.adLabel}
          onChange={(e) => handleChange('adLabel', e.target.value)}
        >
          <option value="ad">Annonse</option>
          <option value="sponsored">Sponset innhold</option>
          <option value="advertiser">Annonsørinnhold</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Bilde-URL</label>
        <input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={config.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
        />
      </div>

      <SaveButton config={config} />
    </div>
  )
}
