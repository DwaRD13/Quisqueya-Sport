// Game-footage recaps only (TV broadcast frames verified visually and via oEmbed, 2026-11-02).
// Commentary, reaction, AI-art and fan-filmed videos are excluded on purpose.
// Most uploads are TV-feed re-uploads by independent channels; the channel is shown for attribution.
// gameId links a video to a game in lidom.json (null = not tied to one LIDOM game).
const L = 'lidom';
const LICEY = 'tigres-del-licey', EO = 'estrellas-orientales', LE = 'leones-del-escogido', AC = 'aguilas-cibaenas', GC = 'gigantes-del-cibao', TE = 'toros-del-este';

export const VIDEOS = [
  { id: 'kUFVDfmDTOc', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (1 nov)', channel: 'Arlin Raf Deportes', date: '2026-11-01', league: L, gameId: 2221, teams: [LICEY, EO] },
  { id: 'hXnhI8yIxNM', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (1 nov)', channel: 'EnterateRDdigital', date: '2026-11-01', league: L, gameId: 2221, teams: [LICEY, EO] },
  { id: 'p4eXVAE_rxM', title: 'Resumen: Leones del Escogido vs Águilas Cibaeñas (1 nov)', channel: 'Arlin Raf Deportes', date: '2026-11-01', league: L, gameId: 2219, teams: [LE, AC] },
  { id: 'LKNyZPcL--c', title: 'Resumen: Gigantes del Cibao vs Toros del Este (1 nov)', channel: 'Arlin Raf Deportes', date: '2026-11-01', league: L, gameId: 2220, teams: [GC, TE] },
  { id: 'vi7IH76jvZg', title: 'Resumen: Toros del Este vs Gigantes del Cibao (1 nov)', channel: 'EnterateRDdigital', date: '2026-11-02', league: L, gameId: 2220, teams: [GC, TE] },
  { id: 'SromcuXxq6M', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (31 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-31', league: L, gameId: 2216, teams: [LICEY, EO] },
  { id: 'Qoq8RP9UemQ', title: 'Estrellas Orientales vs Tigres del Licey · Resumen', channel: 'Tigres del Licey', date: '2026-10-31', league: L, gameId: 2216, teams: [LICEY, EO] },
  { id: 'bhejM-iygNU', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (31 oct)', channel: 'EnterateRDdigital', date: '2026-10-31', league: L, gameId: 2216, teams: [LICEY, EO] },
  { id: 'pGhNAqZsjGY', title: 'Resumen: Gigantes del Cibao vs Toros del Este (31 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-31', league: L, gameId: 2218, teams: [GC, TE] },
  { id: '_D1luGGa5FA', title: 'Leones del Escogido vs Águilas Cibaeñas · Highlights (31 oct)', channel: 'Escogido Baseball Club', date: '2026-10-31', league: L, gameId: 2217, teams: [LE, AC] },
  { id: '9vyGVfXZz8w', title: 'Resumen: Leones del Escogido vs Águilas Cibaeñas (31 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-31', league: L, gameId: 2217, teams: [LE, AC] },
  { id: '3YO2E87muHA', title: 'Resumen: Leones del Escogido vs Águilas Cibaeñas (28 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-28', league: L, gameId: 2211, teams: [LE, AC] },
  { id: 'MSIJZjZNB-Q', title: 'Resumen: Gigantes del Cibao vs Toros del Este (28 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-28', league: L, gameId: 2212, teams: [GC, TE] },
  { id: 'GnPZf5uQDzU', title: 'Resumen: Gigantes del Cibao vs Toros del Este (22 oct)', channel: 'Arlin Raf Deportes', date: '2026-10-22', league: L, gameId: 2198, teams: [GC, TE] },
  { id: 'mTn8EfE_voQ', title: 'República Dominicana vs Costa Rica · NORCECA 2026', channel: 'Reinas del Caribe', date: '2026-08-21', league: 'voleibol', gameId: null, teams: ['reinas'] },
  { id: 'jn8zk0QzTO0', title: 'Reinas del Caribe derrotan a Colombia y ganan el oro', channel: 'Acento TV', date: '2026-08-07', league: 'voleibol', gameId: null, teams: ['reinas'] },
  { id: 'HzQ8RFDz62U', title: 'Resumen: Cañeros vs Metros · LNB 2026 (25 jun)', channel: 'Arlin Raf Deportes', date: '2026-06-25', league: 'lnb', gameId: null, teams: [] },
  { id: '-4ZGy_qTtqo', title: 'Resumen: Gigantes vs Héroes · semifinal LNB 2026', channel: 'Serie002NewYork', date: '2026-06-29', league: 'lnb', gameId: null, teams: [] },
];

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
