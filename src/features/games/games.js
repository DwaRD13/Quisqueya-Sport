import lidom from '../../data/lidom.json';

// Merge every snapshot list into one season, newest data winning by id.
const byId = new Map();
for (const list of [lidom.calendar, lidom.results, lidom.previous, lidom.upcoming, lidom.today]) {
  for (const g of list) byId.set(g.id, g);
}
export const GAMES = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
export const STANDINGS = lidom.standings;
export const SNAPSHOT = { source: lidom.source, fetchedAt: lidom.fetchedAt };

export const getGame = (id) => byId.get(Number(id));
export const dayOf = (g) => g.date.slice(0, 10);
export const isFinal = (g) => g.status === 'final';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export function formatDay(date) {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
export function formatTime(date) {
  const [h, min] = date.slice(11, 16).split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${String(min).padStart(2, '0')} ${suffix}`;
}

// The snapshot day is "today"; it keeps the UI consistent with the captured data.
export const TODAY = lidom.fetchedAt.slice(0, 10);
export const todayGames = () => GAMES.filter((g) => dayOf(g) === TODAY);
export const recentResults = (n = 6) => GAMES.filter(isFinal).slice(-n).reverse();
export const upcomingGames = (n = 6) => GAMES.filter((g) => g.status === 'scheduled' && dayOf(g) > TODAY).slice(0, n);
export const gamesForTeam = (slug) => GAMES.filter((g) => g.away.slug === slug || g.home.slug === slug);

export function winner(g) {
  if (!isFinal(g)) return null;
  return g.away.runs > g.home.runs ? 'away' : 'home';
}

const OTHER = { postponed: 'POSPUESTO', suspended: 'SUSPENDIDO', delayed: 'RETRASADO' };
export function statusLabel(g) {
  if (isFinal(g)) return 'FINAL';
  if (g.status === 'live') return `EN VIVO · ${g.inning}`;
  if (OTHER[g.status]) return OTHER[g.status];
  return dayOf(g) === TODAY ? `HOY · ${formatTime(g.date)}` : formatTime(g.date);
}

// Game times from the source are Dominican local time (UTC-4, no DST).
export const startsAt = (g) => new Date(`${g.date.replace(' ', 'T')}-04:00`).getTime();
const PLAYABLE = new Set(['scheduled', 'preview', 'live', 'delayed']);

// Games still to be played, nearest first. A game stays listed for 4h after first pitch
// so one in progress is not dropped. Optionally limited to one team.
export function nextGames({ team = null, n = 6, now = Date.now() } = {}) {
  return GAMES
    .filter((g) => PLAYABLE.has(g.status) && startsAt(g) > now - 4 * 3600e3)
    .filter((g) => !team || g.away.slug === team || g.home.slug === team)
    .sort((a, b) => startsAt(a) - startsAt(b))
    .slice(0, n);
}
