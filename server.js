import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

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

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
