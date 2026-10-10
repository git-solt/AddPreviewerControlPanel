import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const PERSISTENCE_FILE_STORAGE_PATH = "adds.json"
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// In-memory storage (Map for id lookups), persisted to a JSON array file
const ads = new Map()

function persistAds() {
  fs.writeFileSync(PERSISTENCE_FILE_STORAGE_PATH, JSON.stringify(Array.from(ads.values()), null, 2))
}

if (fs.existsSync(PERSISTENCE_FILE_STORAGE_PATH)) {
  // A corrupt file throws here on purpose, so it is never overwritten with an empty list
  const stored = JSON.parse(fs.readFileSync(PERSISTENCE_FILE_STORAGE_PATH, 'utf-8'))
  for (const ad of stored) {
    ads.set(ad.id, ad)
  }
} else {
  persistAds()
}

// POST /api/ads - Save a new ad configuration
app.post('/api/ads', (req, res) => {
  try {
    const { heading, body, ctaText, theme, imageUrl, adLabel, size } = req.body

    // Validate required fields
    if (!heading) {
      return res.status(400).json({ error: 'Heading is required' })
    }

    const id = uuidv4()
    const adConfig = {
      id,
      heading,
      body,
      ctaText,
      theme,
      imageUrl,
      adLabel,
      size,
      createdAt: new Date().toISOString(),
    }

    ads.set(id, adConfig)
    try {
      persistAds()
    } catch (writeError) {
      ads.delete(id)
      throw writeError
    }
    res.status(201).json(adConfig)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save ad configuration' })
  }
})

// GET /api/ads - Get all saved ads
app.get('/api/ads', (req, res) => {
  try {
    const adsList = Array.from(ads.values())
    res.json(adsList)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ads' })
  }
})

// GET /api/ads/:id - Get a specific ad
app.get('/api/ads/:id', (req, res) => {
  try {
    const { id } = req.params
    const ad = ads.get(id)

    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' })
    }

    res.json(ad)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ad' })
  }
})

// Catch-all for unmatched API routes (404 with JSON)
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Ad Preview Dashboard running on http://localhost:${PORT}`)
})
