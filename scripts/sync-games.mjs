// Snapshot LIDOM data from pelotainvernal.com into src/data/lidom.json.
// Run: node scripts/sync-games.mjs
import { writeFile } from 'node:fs/promises';

const SOURCE = 'https://pelotainvernal.com/';
const html = await (await fetch(SOURCE)).text();
const marker = 'new ViewModel(';
const start = html.indexOf(marker);
if (start < 0) throw new Error('ViewModel payload not found; the source page changed.');

// Walk the JSON array literal by bracket depth, respecting strings.
let i = start + marker.length, depth = 0, inStr = false, esc = false;
const from = i;
for (; i < html.length; i++) {
  const c = html[i];
  if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
  if (c === '"') inStr = true;
  else if (c === '[' || c === '{') depth++;
  else if (c === ']' || c === '}') { depth--; if (depth === 0) { i++; break; } }
}
const [block] = JSON.parse(html.slice(from, i));

// Codes from the source page: STATUS_NOT_STARTED=1 ... STATUS_POSTPONED=7.
const STATUS = { 1: 'scheduled', 2: 'live', 3: 'preview', 4: 'delayed', 5: 'suspended', 6: 'final', 7: 'postponed' };
const team = (t) => ({ name: t.name, abbr: t.abbreviation, color: `#${t.color}`, logo: t.logo,
  slug: t.permalink.split('/').pop(), runs: t.runs, hits: t.hits, errors: t.errors, pitcher: t.pitcher, record: t.record });
const game = (g) => ({ id: g.id, date: g.date, status: STATUS[g.status] ?? 'scheduled', inning: g.roundText,
  away: team(g.awayTeam), home: team(g.homeTeam),
  winningPitcher: g.winningPitcher, losingPitcher: g.losingPitcher, savingPitcher: g.savingPitcher });

// The calendar and results pages load games with a paginated POST back to the same URL.
async function pagedGames(path, month = '') {
  const games = [];
  for (let page = 1; page < 20; page++) {
    const res = await fetch(`${SOURCE}liga/dominicana-lidom/${path}`, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ page: String(page), month, team_id: '' }),
    });
    const batch = await res.json();
    const fresh = batch.filter((g) => !games.some((x) => x.id === g.id));
    games.push(...fresh);
    if (batch.length < 30 || fresh.length === 0) break;
  }
  return games;
}
const results = await pagedGames('resultados');
const calendar = [];
for (const month of ['10-2026', '11-2026', '12-2026', '01-2027']) calendar.push(...(await pagedGames('calendario', month)));

// Team pages are server-rendered: keep the intro paragraphs as the team bio.
const SLUGS = ['tigres-del-licey', 'leones-del-escogido', 'aguilas-cibaenas', 'estrellas-orientales', 'toros-del-este', 'gigantes-del-cibao'];
const teams = {};
for (const slug of SLUGS) {
  const page = await (await fetch(`${SOURCE}equipo/${slug}`)).text();
  const paragraphs = [...page.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter((t) => t.length > 120);
  teams[slug] = { bio: paragraphs.slice(0, 3), sourceUrl: `${SOURCE}equipo/${slug}` };
}

const out = {
  teams,
  source: SOURCE,
  fetchedAt: new Date().toISOString(),
  standings: block.standings.map((s) => ({ team: s.team.name ?? s.team, slug: s.team.permalink?.split('/').pop(),
    wins: s.wins, losses: s.loses, homeW: s.wins_home, homeL: s.loses_home, awayW: s.wins_visitor, awayL: s.loses_visitor,
    gb: s.gb === false ? '—' : String(s.gb), pct: s.pct })),
  today: block.todayGames.map(game),
  previous: block.previousGames.map(game),
  upcoming: block.upcomingGames.map(game),
  results: results.map(game),
  calendar: calendar.map(game),
};
await writeFile(new URL('../src/data/lidom.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`standings ${out.standings.length} · today ${out.today.length} · previous ${out.previous.length} · upcoming ${out.upcoming.length} · results ${out.results.length} · calendar ${out.calendar.length}`);
