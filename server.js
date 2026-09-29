import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// In-memory storage
const ads = new Map()

// POST /api/ads - Save a new ad configuration
app.post('/api/ads', (req, res) => {
  try {
    const { heading, body, ctaText, theme, imageUrl } = req.body

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
      createdAt: new Date().toISOString(),
    }

    ads.set(id, adConfig)
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
