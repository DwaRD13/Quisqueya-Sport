Objective: full modern redesign of Quisqueya Sport with real images, prices, videos and game data.
Branch: feat/redesign · Delivery: ask-on-risk · Test runner: none (Vite build + browser checks)

## Specs
- S1 "Rediseño moderno de TODA la web, con cada página y sección funcional y con contenido real (imágenes reales, videos reproducibles, datos de partidos recientes)." Design system "Estadio de noche" approved (canvas https://claude.ai/artifact/4vFTiCVT6RGPRTR1TXPGoW).
- S2 "Que sea de todo los deportes que ya estan, si no se encuentra para las otras areas, dejalos base que tiene ya pero mejorandolos"
- S3 "Reemplaza todos los SVG ilustrativos ... por fotos reales buscadas en la web. Usa la URL directa de la imagen" + placeholder fallback if URL fails.
- S4 "para las fotos y precios reales tienes que buscar en internet todo."
- S5 Real embeddable videos (YouTube) for recent games; verify each loads.
- S6 Game data, results and calendar based on pelotainvernal.com, not invented.
- S7 Every page/section functional: navigation, filters, search, detail, cart, player, empty and error states. No dead buttons.
- S8 Responsive verified in browser; final summary per page with pending items.

## Tasks
- [x] T1 S6 real data snapshot (pelotainvernal: home + calendario/resultados POST + team pages) · inline
- [x] T2 S3,S4 images + prices · delegated research + inline Playwright catalog (24 products, 6 tickets)
- [x] T3 S5 videos · delegated research; 13 embeds verified in-app
- [x] T4 S1,S2,S7 rebuild app with routes + design system · inline
- [x] T5 S8 Playwright audit 22 routes desktop+390px: 0 overflow, 0 console errors; flows cart/checkout/search/filters/plans pass

## Log
- L1 (2026-11-02) User request: phased redesign brief (Fases 1–5, criterios de terminado).
- L2 Phase 1 inventory approved; keep all sports (S2). Phase 2 design approved; S4 added.
- L3 Evidence: status codes mapped from source (7=postponed, not live). Store prices are RD$ from Peligro Sports (currency DOP). No stadium food prices found → food removed. No photos for Micheli, Palacio Deportes, Palacio Voleibol, Granjeros → fallback.
