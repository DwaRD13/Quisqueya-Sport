import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Img, SectionHeader, Chips, money } from '../../shared/ui.jsx';
import GameCard, { TeamLogo } from '../games/GameCard.jsx';
import { STANDINGS, statusLabel, recentResults, todayGames, upcomingGames } from '../games/games.js';
import { LEAGUES, TEAMS, getStadium, getTeam } from '../../data/catalog.js';
import { VIDEOS, thumb } from '../../data/videos.js';
import { CATALOG } from '../store/cart.jsx';
import ProductCard from '../store/ProductCard.jsx';
import { TeamCard } from '../teams/TeamsPages.jsx';

const TABS = [
  { id: 'results', label: 'Resultados' },
  { id: 'today', label: 'Hoy' },
  { id: 'next', label: 'Próximos' },
];

function Hero() {
  const game = todayGames()[0] ?? upcomingGames(1)[0];
  if (!game) return null;
  const home = getTeam(game.home.slug);
  const stadium = getStadium(home?.stadium);
  const rec = (slug) => STANDINGS.find((s) => s.slug === slug);
  const a = rec(game.away.slug);
  const h = rec(game.home.slug);
  return (
    <section aria-label="Partido destacado" className="relative flex min-h-[440px] items-end overflow-hidden rounded-3xl">
      <Img src={stadium?.image} alt={stadium?.name ?? 'Estadio'} className="absolute inset-0 h-full w-full" />
      <div className="relative flex w-full flex-wrap items-end justify-between gap-8 bg-gradient-to-t from-night via-night/85 to-transparent p-6 pt-32 sm:p-10">
        <div className="flex max-w-xl flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="tag bg-flag-deep text-flag-soft">{statusLabel(game)}</span>
            <span className="tag bg-line">LIDOM · SERIE REGULAR</span>
          </div>
          <h1 className="h-display text-5xl sm:text-7xl lg:text-8xl">{game.away.name}<br /><span className="text-[0.5em] text-muted">en</span> {game.home.name}</h1>
          {a && h && <p className="text-muted">{home?.name} ({h.wins}-{h.losses}) recibe a {getTeam(game.away.slug)?.name} ({a.wins}-{a.losses}){stadium ? ` en el ${stadium.name}` : ''}.</p>}
          <div className="flex flex-wrap gap-3">
            <Link to={`/partidos/${game.id}`} className="btn-primary">Ver partido</Link>
            <Link to="/partidos?vista=upcoming" className="btn-ghost">Calendario completo</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TeamLogo team={game.away} size={96} />
          <span className="font-mono text-2xl font-bold text-faint">VS</span>
          <TeamLogo team={game.home} size={96} />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [tab, setTab] = useState('results');
  const [league, setLeague] = useState('all');
  const games = { results: recentResults(6), today: todayGames(), next: upcomingGames(6) }[tab];
  const latestVideos = [...VIDEOS].sort((x, y) => y.date.localeCompare(x.date)).slice(0, 3);
  const featured = ['official-licey-jersey-2026-white', 'aguilas-cibaenas-new-era-59fifty', '2026-2027-leones-del-escogido-authentic-jersey-white-red', 'ticket-palcos-a']
    .map((id) => CATALOG.find((p) => p.id === id) ?? CATALOG.find((p) => p.id.startsWith(id))).filter(Boolean);
  const teams = TEAMS.filter((t) => league === 'all' || t.league === league);

  return (
    <div className="flex flex-col gap-14">
      <Hero />

      <div className="flex flex-wrap gap-8">
        <section className="min-w-0 flex-[999_1_560px]">
          <SectionHeader title="Partidos" to="/partidos">
            <Chips label="Partidos" options={TABS} value={tab} onChange={setTab} />
          </SectionHeader>
          {games.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{games.map((g) => <GameCard key={g.id} game={g} />)}</div>
          ) : <p className="card p-8 text-center text-muted">No hay partidos en esta vista.</p>}
        </section>
        <aside className="card flex-[1_1_300px] self-start p-5">
          <h2 className="mb-3 font-display text-2xl font-bold uppercase">Posiciones LIDOM</h2>
          <table className="w-full text-sm">
            <thead className="font-mono text-[11px] text-muted"><tr className="text-right"><th className="py-2 text-left">EQUIPO</th><th>G</th><th>P</th><th>PCT</th><th>JD</th></tr></thead>
            <tbody className="font-mono">
              {STANDINGS.map((s) => (
                <tr key={s.slug} className="border-t border-line text-right">
                  <td className="py-3 text-left font-sans font-semibold"><Link to={`/equipos/${s.slug}`} className="flex items-center gap-2 hover:text-flag-soft"><span className="h-2.5 w-2.5 rounded-full" style={{ background: getTeam(s.slug)?.color }} />{s.team}</Link></td>
                  <td>{s.wins}</td><td>{s.losses}</td><td>{s.pct}</td><td className="text-muted">{s.gb}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/posiciones" className="mt-3 inline-block text-sm font-semibold text-flag-soft">Tabla completa →</Link>
        </aside>
      </div>

      <section>
        <SectionHeader title="Videos" to="/videos" />
        <div className="grid gap-4 md:grid-cols-3">
          {latestVideos.map((v) => (
            <Link key={v.id} to={v.gameId ? `/partidos/${v.gameId}` : '/videos'} className="group flex flex-col gap-2">
              <div className="relative overflow-hidden rounded-2xl">
                <Img src={thumb(v.id)} alt={v.title} className="aspect-video w-full transition group-hover:scale-[1.03]" />
                <span className="absolute bottom-3 left-3 tag bg-red text-white">▶ VER</span>
              </div>
              <b className="leading-snug">{v.title}</b>
              <span className="text-xs text-muted">{v.channel}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Equipos" to="/equipos">
          <Chips label="Liga" options={LEAGUES} value={league} onChange={setLeague} />
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{teams.map((t) => <TeamCard key={t.slug} team={t} />)}</div>
      </section>

      <section>
        <SectionHeader title="Tienda oficial" to="/tienda" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        <p className="mt-3 text-xs text-muted">Boletas desde {money(350)} · jerseys desde {money(Math.min(...CATALOG.filter((p) => p.category === 'jersey').map((p) => p.price)))}</p>
      </section>
    </div>
  );
}
