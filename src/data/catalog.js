import lidom from './lidom.json';

const W = 'https://upload.wikimedia.org/wikipedia/commons/';

export const LEAGUES = [
  { id: 'all', label: 'Todos' },
  { id: 'lidom', label: 'Béisbol · LIDOM' },
  { id: 'lnb', label: 'Baloncesto · LNB' },
  { id: 'voleibol', label: 'Voleibol' },
  { id: 'verano', label: 'Liga de Verano' },
];

// Photos from Wikimedia Commons, verified 2026-11-02. null = no real photo found (fallback shown).
export const STADIUMS = [
  { id: 'quisqueya', name: 'Estadio Quisqueya Juan Marichal', city: 'Santo Domingo', league: 'lidom', teams: ['tigres-del-licey', 'leones-del-escogido'], image: `${W}5/5a/Grandstand_(Estadio_Quisqueya).jpg`, gallery: [`${W}e/ef/Estadio_Quisqueya_Juan_Marichal_(Main_Entrance).jpg`] },
  { id: 'cibao', name: 'Estadio Cibao', city: 'Santiago de los Caballeros', league: 'lidom', teams: ['aguilas-cibaenas'], image: `${W}0/07/Estadio_Cibao_Drone.jpg`, gallery: [`${W}d/d0/Estadio_Cibao.jpg`] },
  { id: 'tetelo', name: 'Estadio Tetelo Vargas', city: 'San Pedro de Macorís', league: 'lidom', teams: ['estrellas-orientales'], image: `${W}5/55/Estadio_Tetelo_Vargas.png`, gallery: [] },
  { id: 'micheli', name: 'Estadio Francisco A. Micheli', city: 'La Romana', league: 'lidom', teams: ['toros-del-este'], image: null, gallery: [] },
  { id: 'julian-javier', name: 'Estadio Julián Javier', city: 'San Francisco de Macorís', league: 'lidom', teams: ['gigantes-del-cibao'], image: `${W}a/a5/Estadio_Julian_Javier.jpg`, gallery: [`${W}e/e7/Manny_Ramirez_enfrentando_a_Kevin_Pucetas_en_el_Julian_Javier..JPG`] },
  { id: 'palacio-deportes', name: 'Palacio de los Deportes Virgilio Travieso Soto', city: 'Santo Domingo', league: 'lnb', teams: ['titanes'], image: null, gallery: [] },
  { id: 'palacio-voleibol', name: 'Palacio del Voleibol Ricardo Arias', city: 'Santo Domingo', league: 'voleibol', teams: ['reinas'], image: null, gallery: [] },
];

const fromGames = {};
for (const g of [...lidom.calendar, ...lidom.results]) {
  for (const t of [g.away, g.home]) fromGames[t.slug] = { abbr: t.abbr, color: t.color, logo: t.logo };
}

const LIDOM_TEAMS = [
  { slug: 'tigres-del-licey', name: 'Tigres del Licey', short: 'Tigres', city: 'Santo Domingo', stadium: 'quisqueya', founded: 1907, image: `${W}5/5a/Grandstand_(Estadio_Quisqueya).jpg` },
  { slug: 'leones-del-escogido', name: 'Leones del Escogido', short: 'Leones', city: 'Santo Domingo', stadium: 'quisqueya', founded: 1921, image: `${W}a/a1/Leones_del_Escogido_retired_numbers.jpg` },
  { slug: 'aguilas-cibaenas', name: 'Águilas Cibaeñas', short: 'Aguilas', city: 'Santiago', stadium: 'cibao', founded: 1933, image: `${W}0/07/Estadio_Cibao_Drone.jpg` },
  { slug: 'estrellas-orientales', name: 'Estrellas Orientales', short: 'Estrellas', city: 'San Pedro de Macorís', stadium: 'tetelo', founded: 1910, image: `${W}b/b3/Abraham_Almonte_con_las_Estrellas_Orientales.png` },
  { slug: 'toros-del-este', name: 'Toros del Este', short: 'Toros', city: 'La Romana', stadium: 'micheli', founded: 1983, image: `${W}c/ca/Uniformes_Toros_Del_Este.png` },
  { slug: 'gigantes-del-cibao', name: 'Gigantes del Cibao', short: 'Gigantes', city: 'San Francisco de Macorís', stadium: 'julian-javier', founded: 1996, image: `${W}b/ba/JEFFRY_NI%C3%91O_CON_GIGANTES_DEL_CIBAO_EN_LA_LIDOM_2022_VS_TIGRES_DEL_LICEY.jpg` },
].map((t) => ({ ...t, league: 'lidom', ...fromGames[t.slug], bio: lidom.teams[t.slug]?.bio ?? [], sourceUrl: lidom.teams[t.slug]?.sourceUrl }));

// Non-LIDOM teams keep the prototype's base content; no live data source was found for them.
const OTHER_TEAMS = [
  { slug: 'reinas', name: 'Reinas del Caribe', short: 'Reinas', league: 'voleibol', city: 'Santo Domingo', stadium: 'palacio-voleibol', abbr: 'RD', color: '#E63946', logo: null, image: `${W}b/bb/Volleyball%2C_Russia_vs_Dominican_Republic.jpg`, bio: ['Selección nacional femenina de voleibol de la República Dominicana, conocida como las Reinas del Caribe. En agosto de 2026 vencieron a Colombia en la final y se llevaron el oro.'] },
  { slug: 'titanes', name: 'Titanes del Distrito', short: 'Titanes', league: 'lnb', city: 'Santo Domingo', stadium: 'palacio-deportes', abbr: 'TD', color: '#2F6BFF', logo: null, image: `${W}c/c7/Titanes_del_Distrito.jpg`, bio: ['Equipo de baloncesto de la Liga Nacional de Baloncesto (LNB) con sede en el Distrito Nacional.'] },
  { slug: 'granjeros', name: 'Granjeros de Moca', short: 'Granjeros', league: 'verano', city: 'Moca', stadium: null, abbr: 'GM', color: '#3FA34D', logo: null, image: null, bio: ['Equipo de la Liga de Verano con sede en Moca, provincia Espaillat.'] },
];

export const TEAMS = [...LIDOM_TEAMS, ...OTHER_TEAMS];
export const getTeam = (slug) => TEAMS.find((t) => t.slug === slug);
export const getStadium = (id) => STADIUMS.find((s) => s.id === id);

// Real 2026-27 Leones del Escogido single-game prices at Estadio Quisqueya.
export const TICKETS_SOURCE = 'https://revistamercado.do/empresas/sport-business/cuanto-cuesta-asistir-a-un-partido-de-lidom-esta-temporada/';
export const TICKETS = [
  ['gradas', 'Gradas', 350],
  ['palcos-aaa', 'Palcos AAA', 650],
  ['preferencia', 'Preferencia', 800],
  ['palcos-aa', 'Palcos AA', 1300],
  ['palcos-a', 'Palcos A', 2000],
  ['corporativos', 'Corporativos', 3800],
].map(([id, zone, price]) => ({
  id: `ticket-${id}`,
  name: `Boleta ${zone} · Leones del Escogido`,
  team: 'leones-del-escogido',
  category: 'tickets',
  price,
  image: `${W}f/f4/Boleter%C3%ADa_(Leones_del_Escogido).jpg`,
  sizes: [],
  inStock: true,
  sourceUrl: TICKETS_SOURCE,
}));
