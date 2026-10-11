import type { AdConfig, SavedAd } from '../components/ConfigForm'

const ADS_URL = '/api/ads'

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function getAds(): Promise<SavedAd[]> {
  return request<SavedAd[]>(ADS_URL)
}

export function createAd(config: AdConfig): Promise<SavedAd> {
  return request<SavedAd>(ADS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  })
}
