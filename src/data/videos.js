// YouTube videos verified as embeddable via oEmbed on 2026-11-02.
// None come from official league channels; channel is shown for attribution.
// gameId links a video to a game in lidom.json (null = not tied to one game).
export const VIDEOS = [
  { id: 'wyn1-ngNo0g', title: 'Escogido 2–1 Águilas · Final en el Quisqueya', channel: 'Sonlatino', date: '2026-11-01', league: 'lidom', gameId: 2219, teams: ['leones-del-escogido', 'aguilas-cibaenas'] },
  { id: 'jDhtU4hzBpU', title: 'El León volvió a vencer al Águila 2-1 (análisis)', channel: 'SFM Conecta', date: '2026-11-01', league: 'lidom', gameId: 2219, teams: ['leones-del-escogido', 'aguilas-cibaenas'] },
  { id: '9KH3yyR_y6c', title: 'Gigantes del Cibao aplastan 13-7 a los Toros del Este', channel: 'SFM Conecta', date: '2026-11-01', league: 'lidom', gameId: 2220, teams: ['gigantes-del-cibao', 'toros-del-este'] },
  { id: 'RBmAFP653VQ', title: 'Cuadrangular de Pascanel Ferreras ante los Toros', channel: 'El Chamo Deportes', date: '2026-11-02', league: 'lidom', gameId: 2220, teams: ['gigantes-del-cibao', 'toros-del-este'] },
  { id: 'sFDJaq2FVuA', title: 'Toros vs Gigantes en San Francisco de Macorís', channel: 'Multimedios Cristo Rey', date: '2026-11-01', league: 'lidom', gameId: 2220, teams: ['gigantes-del-cibao', 'toros-del-este'] },
  { id: 'hXnhI8yIxNM', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (01/11)', channel: 'EnterateRDdigital', date: '2026-11-01', league: 'lidom', gameId: 2221, teams: ['tigres-del-licey', 'estrellas-orientales'] },
  { id: 'B3xqQ1ygy5w', title: 'Final en San Pedro: Licey 2-1 Estrellas', channel: 'MEGA DEPORTES', date: '2026-11-01', league: 'lidom', gameId: 2221, teams: ['tigres-del-licey', 'estrellas-orientales'] },
  { id: 'bhejM-iygNU', title: 'Resumen: Tigres del Licey vs Estrellas Orientales (31/10)', channel: 'EnterateRDdigital', date: '2026-10-31', league: 'lidom', gameId: 2216, teams: ['tigres-del-licey', 'estrellas-orientales'] },
  { id: 'DuaUAqsPtMA', title: 'Águilas vs Leones · Resumen del juego', channel: 'Beisbol RD Podcast', date: '2026-11-01', league: 'lidom', gameId: null, teams: ['aguilas-cibaenas', 'leones-del-escogido'] },
  { id: 'jn8zk0QzTO0', title: 'Reinas del Caribe derrotan a Colombia y ganan el oro', channel: 'Acento TV', date: '2026-08-07', league: 'voleibol', gameId: null, teams: ['reinas'] },
  { id: 'RMctttFbW78', title: 'República Dominicana vs Estados Unidos · NORCECA 2026', channel: 'Reinas del Caribe', date: '2026-08-25', league: 'voleibol', gameId: null, teams: ['reinas'] },
  { id: 'P72GjmabVAM', title: 'Diego Colón 21 puntos · Titanes', channel: 'MAREGA DEPORTES', date: '2026-06-20', league: 'lnb', gameId: null, teams: ['titanes'] },
  { id: 'OvDxXk6H6Vc', title: 'Richard Bautista · Titanes', channel: 'MAREGA DEPORTES', date: '2026-06-20', league: 'lnb', gameId: null, teams: ['titanes'] },
];

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
