Objective: turn Quisqueya Sport into a simulated sports e-commerce (accounts, cart, checkout, payments, plans), all client-side.
Branch: feat/redesign · Delivery: ask-on-risk · Test runner: none (Vite build + Playwright flow checks)

## Specs
- S1 "implementacion simulada (sin backend real) de un usuario y la compra de obejetos en la tienda, y los planes"
- S2 "La idea de esta sitio web es que sea un eccomerce para los asuntos deportivos. El foco principal es la pelota dominicana pero tambien se puede de otros deportes como anexo."
- S3 "implementar ahora un flujo de creacion de usuario, compra real en un carrito, con pagina de pago (todo simulado)"
- S4 "Con el tema de los precios de la comida puede ser simulados con los reales de repbulica dominicana."
- S5 "con el tema de los videos de los partidos ahi veo que hay videos que no son de los partidos recientes de youtube o resumenes, por lo que veo es comentarios de personas." → keep only real game footage.
- S6 Pending from redesign: Ecosistema restyle, missing photos, .DS_Store ignore.
- Approved plan (L2): services layer over localStorage; hashed passwords; guest checkout + cart merge on login; 3-step checkout (delivery, payment, confirmation); test cards 4242 ok / 4000…0002 declined / 4000…9995 insufficient funds; ITBIS 18%; simulated order status + stock; plans with simulated payment, VIP 10% store discount, PPV 24h pass.

## Tasks
- [x] T1 S5 videos re-curation · delegated research + inline
- [x] T2 S1,S3 services + accounts (register/login/account) · inline
- [x] T3 S3 cart + checkout + payment + orders · inline
- [x] T4 S4 stadium food with RD prices · delegated research + inline
- [x] T5 S1 plans subscription + discount · inline
- [x] T6 S6 visual pendings · inline

## Log
- L1 (2026-11-02) User request: "Perfecto ahora hay que trabajar en todo lo que quedo pendiente..." (S1–S5 quoted above).
- L2 Plan approved: "Perfecto, me parece bien. Procede con el trabajo"
- L3 Evidence: 18 videos with TV footage (frames checked), all play in-app. Food prices simulated (only empanada RD$40–75 and Presidente ~RD$100 references found). Micheli photo found; Palacios + Granjeros still fallback. Bug found+fixed: cart.clear() crashed (setLines array). Playwright e2e 25 checks pass (register, merge cart, delivery rules, Luhn, declined/insufficient/approved, order, VIP discount, PPV, auth redirect, login). Header wrap fixed (nav at xl).
