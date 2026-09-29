# Ad Preview & Mini-Dashboard

En interaktiv demo for Polaris Media som viser sanntids annonsekonfigurasjon og toveis-kommunikasjon med en embedded `iframe` som simulerer et mediehus.

## Arkitektur

### Deployment
- **Single origin**: Frontend (React build) og backend (Express) kjører på samme port
- Ingen CORS-problemer
- Enkel deployment

### Frontend (React + TypeScript)
- **Vite** for rask utvikling og building
- **React 19** med TypeScript for typesikker komponentutvikling
- **postMessage API** for sikker kommunikasjon med iframe
- Bygges til statiske filer i `dist/`

### Backend (Node.js + Express)
- Serverer React build-filene fra `dist/`
- REST API for å lagre og hente annonsekonfigurasjoner
- In-memory storage (for demo-formål)
- Single port for både frontend og backend

### iframe Preview
- Standalone HTML-side som simulerer en avis
- Lytter på `postMessage` fra parent window
- Validerer origin for sikkerhet
- Sender bekreftelse tilbake til parent

## Funksjoner

### Konfigurasjonsform
- Overskrift (påkrevd)
- Brødtekst
- CTA-tekst (knappetekst)
- Tema (Blå, Rød, Grønn, Mørk)
- Bilde-URL

### Sanntids forhåndsvisning
- Oppdateres umiddelbart når felter endres
- Tema-farger reflekteres i preview
- Bilder vises med proportional skalering

### Meldingslogg (Event Log)
- Viser alle `postMessage`-hendelser
- Grønn indikator for sendte meldinger
- Blå indikator for mottatte meldinger
- Begrenset til 100 siste events for minneeffektivitet

### Lagring av utkast
- "Lagre utkast"-knapp som sender til backend
- Hvert utkast får en unik ID
- Backend returnerer ID ved vellykket lagring

## Sikkerhet

- **Origin-validering**: Both parent og iframe validerer `event.origin`
- **URL-validering**: Bilder må være gyldige URL-er
- **Input-validering**: Overskrift er påkrevd
- **Temavalidering**: Bare gyldige temaverdier godtas

## Installasjon

```bash
npm install
```

## Utvikling (begge fra samme terminal)

```bash
# Terminal 1: Frontend dev-server
npm run dev
```

Åpne http://localhost:5173 (Vite sin default port)

## Produksjon (single origin)

Frontend og backend hostes sammen på samme origin:

```bash
# Build React og start server
npm start
```

Serveren kjører på http://localhost:3001 (kan endres med `PORT` env-var)

Eller bygg først og start separat:

```bash
npm run build
npm run server
```

## Bygging

```bash
# Build React til dist/
npm run build
```

Express serverer automatisk React-filene fra `dist/` på `/` og API fra `/api/`

## Prosjektstruktur

```
src/
├── components/
│   ├── ConfigForm.tsx      # Annonsekonfigurasjonsform
│   ├── PreviewFrame.tsx    # Iframe-wrapper med postMessage
│   ├── EventLog.tsx        # Meldingslogg
│   └── SaveButton.tsx      # Backend-lagring
├── App.tsx                 # Hovedkomponent
├── App.css                 # Styling
└── main.tsx               # Entry point

public/
└── preview.html           # Iframe-siden (avis-mockup)

server.js                  # Express backend
```

## API Endpoints

### POST /api/ads
Lagrer en ny annonsekonfigurasjon.

**Request:**
```json
{
  "heading": "string",
  "body": "string",
  "ctaText": "string",
  "theme": "blue|red|green|dark",
  "imageUrl": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "heading": "string",
  "body": "string",
  "ctaText": "string",
  "theme": "string",
  "imageUrl": "string",
  "createdAt": "ISO8601"
}
```

### GET /api/ads
Henter alle lagrede utkast.

### GET /api/ads/:id
Henter en spesifikk utkast.

## Utviklingsnotater

### postMessage-protokoll

**AD_CONFIG_UPDATE** (parent → iframe)
```javascript
{
  type: 'AD_CONFIG_UPDATE',
  payload: { heading, body, ctaText, theme, imageUrl }
}
```

**AD_CONFIG_ACK** (iframe → parent)
```javascript
{
  type: 'AD_CONFIG_ACK',
  data: { timestamp }
}
```

### Performance-optimaliseringer

- EventLog begrenset til 100 events for å unngå minnelekk
- useCallback brukt for å unngå uendelige loops
- Flexbox-layout for responsivitet

## Browser-kompatibilitet

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Ikke støttet (ES6+ kode)

## Lisens

ISC
