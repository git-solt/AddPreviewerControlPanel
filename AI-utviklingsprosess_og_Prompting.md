# AI-utviklingsprosess & Prompting

-   **PRD som Context:** *PRD-en (`prd_ad_preview_mini_dashboard.md`)
    ble skrevet først for å definere funksjonelle krav, datastrukturer
    og tekniske rammebetingelser (React/TS, Express).*

-   **Prompting-strategi:** *Tech stack ble eksplisitt definert i PRD-en
    og matet inn i AI-verktøyet (f.eks. Cursor / Claude 3.5 Sonnet /
    ChatGPT) for å sikre at AI-en genererte typesterk kode og fulgte
    ønsket mønster for `postMessage`-sikkerhet.*

-   **Prosess:**

    1.  **Master Prompt:** *PRD lagt ved som kontekst.*
    2.  **Iterativ koding:** *AI genererte komponenter og
        backend-rutiner.*
    3.  **Menneskelig validering:** *Gjennomgang av typer, error
        handling og sikkerhetskontroll på `postMessage` origin.*
