# GoonFitness

Een lokale, mobile-first trainingsapp in het Nederlands. De gegevensbron is IndexedDB via Dexie; er is geen account of betaalde API nodig.

## Benodigdheden

Installeer Node.js LTS vanaf [nodejs.org](https://nodejs.org/) op Windows en heropen daarna VS Code. Kies **File → Open Folder** en open de map `gymapp`.

## Lokaal starten

Open in VS Code **Terminal → New Terminal** en voer uit:

```powershell
npm install
npm run dev
```

Open de lokale URL die Vite toont. Test op een iPhone op hetzelfde wifi-netwerk met `npm run dev -- --host 0.0.0.0` en open op de iPhone `http://<IP-ADRES-VAN-JE-PC>:5173`. Zet Windows-netwerktoegang voor Node/Vite zo nodig aan. Safari vereist HTTPS voor installatie; de lokale HTTP-pagina is bedoeld voor testgebruik.

## Controleren en bouwen

```powershell
npm test
npm run build
npm run preview
```

De productie-uitvoer staat in `dist/`.

## Gratis publiceren

Je kunt de map `dist` publiceren op GitHub Pages, Cloudflare Pages of Netlify. Voor GitHub Pages configureer je de Vite `base` op de repositorynaam wanneer de site onder een subpad staat, bouw je opnieuw en publiceer je `dist`. Een statische host moet HTTPS aanbieden voor PWA-installatie en offline caching. Publicatie is nog niet uitgevoerd.

## Installeren op iPhone

Open de HTTPS-site in Safari, tik op **Deel → Zet op beginscherm**. De service worker cachet de app shell. Safari/iOS kan timers pauzeren wanneer de app op de achtergrond staat; houd rekening met onderbreking.

## Gegevens en back-ups

In **Instellingen → Back-up & gegevens** exporteer je een volledige JSON-back-up of CSV van trainingen. Kies **Back-up herstellen** om een JSON-bestand te valideren en samen te voegen; identieke IDs worden vervangen na bevestiging. Bewaar exports ook buiten de telefoon. Browseropslag is lokaal, kan door de gebruiker of het systeem worden gewist en wordt niet automatisch naar de cloud gekopieerd. Er is geen cloudsynchronisatie.

## Huidige scope

De basis omvat oefenbibliotheek, routines samenstellen met oefeningen en doelsets, sessies autosaven en hervatten, sets bijhouden, trainingshistorie, schattingen van 1RM met de Epley-formule voor gewogen sets, lichaamsmetingen met datum, een rusttimer en voortgangsgrafieken per oefening (zwaarste set, geschatte 1RM en volume). De rusttimer gebruikt een eindtijd zodat hij na het terugkeren uit een achtergrondtab de resterende tijd kan bijwerken. Oefeningssets en historie blijven volledig lokaal.
