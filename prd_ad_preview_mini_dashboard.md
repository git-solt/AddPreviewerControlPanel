# Product Requirement Document (PRD)

## Prosjekt: Ad-Preview & Mini-Dashboard
**Formål:** En interaktiv demo for Polaris Media som viser sanntids annonsekonfigurasjon og toveis-kommunikasjon med en embedded `iframe` (som simulerer et mediehus).

---

## 1. Bakgrunn og Målsetting
Medierådgivere i Polaris Media har behov for verktøy for å konfigurere, forhåndsvise og tilpasse annonser på tvers av over 60 ulike mediehus. Dette demo-prosjektet har som mål å demonstrere:
* Moderne, responsivt grensesnitt bygget i **React (TypeScript)**.
* Sikker og effektiv inter-window kommunikasjon via browser **`postMessage` API**.
* Enkel backend-integrasjon i **Node.js (Express)** for lagring av konfigurasjoner.
* Effektiv bruk av **AI-assistert utvikling** med god arkitekturforståelse.

---

## 2. Målgruppe & Brukerscenario
* **Målgruppe:** Medierådgivere og annonseutviklere.
* **Scenarioflyt:**
  1. Brukeren åpner dashboardet og ser et skjema for annonsekonfigurasjon til venstre og en fiktiv nettavis til høyre.
  2. Brukeren endrer tekst, farger, CTA (Call To Action) eller bilde-URL i skjemaet.
  3. Endringene oppdateres umiddelbart i avisens annonsefelt via `postMessage` i sanntid.
  4. Brukeren trykker "Lagre utkast", noe som sender dataene til en Node/Express backend.

---

## 3. Funksjonelle Krav

### 3.1 Frontend (React + TypeScript)
* **Skjema for annonsekonfigurasjon:**
  * Overskrift (Input)
  * Brødtekst (Textarea)
  * Knappetekst / CTA (Input)
  * Tema/Fargevalg (Radio / Dropdown: Blå, Rød, Grønn, Mørk)
  * Bilde-URL (Input)
* **Iframe Sandbox:**
  * En embedded HTML-side (`/preview.html`) som simulerer et avisskjermbilde (f.eks. *Adresseavisen*).
* **Sanntidsoppdatering:**
  * Ved hver endring i skjemaet sendes en strukturert event til `iframe.contentWindow.postMessage()`.
* **Hendelseslogg (Event Log):**
  * Et lite loggpanel nederst som viser inn- og utgående `postMessage`-hendelser (viser at utvikleren forstår meldingsutveksling).

### 3.2 Live Preview Page (`iframe` mock)
* Standalone HTML/JS-side som kjører i iframen.
* Lytter på `window.addEventListener('message')`.
* Verifiserer meldingens format og oppdaterer DOM-elementene dynamisk basert på mottatt konfigurasjon.
* Kaster en bekreftelsesmelding (`postMessage`) tilbake til parent window for å bekrefte oppdateringen.

### 3.3 Backend (Node.js + Express)
* **REST Endpoints:**
  * `POST /api/ads` – Lagrer en ny annonsekonfigurasjon (in-memory eller enkel JSON-fil storage).
  * `GET /api/ads` – Henter liste over lagrede utkast.
  * `GET /api/ads/:id` – Henter en spesifikk konfigurasjon.
* **CORS & Middleware:**
  * Konfigurert for å tillate oppkall fra frontend-klienten.

---

## 4. Tekniske Rammebetingelser & Arkitektur
* **Språk/Tech Stack:** React 18+, TypeScript, Node.js, Express, Tailwind CSS (eller ren CSS).
* **AI-Assistert Prosess:** Prosjektet skal bygges raskt (2–4 timer) ved hjelp av AI-prompting, men koden skal være oversiktlig og modulær.
* **Sikkerhet:** Sjekk av `origin` i `postMessage`-lytteren for å demonstrere god praksis ved kommunikasjon på tvers av vinduer/domener.

---

## 5. Målkriterier & Success Metrics
1. **Funksjonalitet:** Endringer i frontend oppdateres umiddelbart i `iframe` uten sideinnlasting.
2. **Kodekvalitet:** Ryddig typetestet TypeScript-kode, tydelige komponentgrenser og god feilhåndtering.
3. **Dokumentasjon:** Prosjektet inkluderer denne PRD-en samt en `README.md` som forklarer hvordan koden og AI-promptene ble strukturert.