## Configuare l'App

```sh
git clone {urlRepo}
```

## Installare Dipendenze

```sh
npm install
```

## Configura variabili d'ambiente file .env

```sh
GEMINI_API_KEY=la-tua-chiave-api
```

## Avvia l'applicazione

```sh
npm run dev
```

## TODO

1. **Configurazione Iniziale**

   - [x] Impostare l'ambiente di sviluppo
   - [x] Configurare Tailwind CSS in `tailwind.config.js`
   - [x] Configurare Nuxt.js in `nuxt.config.ts`

2. **Caricamento PDF**

   - [x] Creare un componente per il caricamento dei PDF (`UploadPdf.vue`)
   - [x] Implementare la logica di caricamento nel backend

3. **Elaborazione con AI**

   - [x] Integrare un servizio di AI per l'elaborazione dei PDF
   - [x] Implementare la logica di estrazione del contenuto importante

4. **Salvare chat nel Database e storico chat per utente**

   - [x] Salvare chat nel database
   - [x] Salvare dati del file
   - [ ] Upload del pdf su UploadThing
   - [x] Implementare storico chat per utente

5. **Evidenziazione del Contenuto**

   - [ ] Creare un componente per visualizzare ed evidenziare il contenuto estratto (`HighlightContent.vue`)
   - [ ] Implementare la logica di evidenziazione nel PDF

6. **Interfaccia Utente**
   - [ ] Progettare l'interfaccia utente per la gestione dei PDF
   - [x] Implementare la navigazione tra le diverse sezioni dell'applicazione
