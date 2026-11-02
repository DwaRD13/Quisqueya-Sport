import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Chips, EmptyState, Img, PageHeader } from '../../shared/ui.jsx';
import { LEAGUES, TEAMS, getStadium, getTeam } from '../../data/catalog.js';
import { STANDINGS, gamesForTeam, isFinal, TODAY, dayOf } from '../games/games.js';
import GameCard, { TeamLogo } from '../games/GameCard.jsx';
import { VIDEOS } from '../../data/videos.js';
import VideoPlayer from '../videos/VideoPlayer.jsx';
import ProductCard from '../store/ProductCard.jsx';
import { CATALOG } from '../store/cart.jsx';

const recordOf = (slug) => STANDINGS.find((s) => s.slug === slug);

export function TeamCard({ team }) {
  const rec = recordOf(team.slug);
  return (
    <Link to={`/equipos/${team.slug}`} className="card group overflow-hidden transition hover:ring-1 hover:ring-edge">
      <Img src={team.image} alt={team.name} className="aspect-[16/9] w-full transition group-hover:scale-[1.02]" />
      <div className="flex items-center gap-3 border-t-4 p-4" style={{ borderColor: team.color }}>
        {team.logo ? <TeamLogo team={team} size={44} /> : <span className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-sm font-bold" style={{ background: team.color }}>{team.abbr}</span>}
        <div className="min-w-0">
          <p className="truncate font-semibold">{team.name}</p>
          <p className="font-mono text-xs text-muted">{rec ? `${rec.wins}-${rec.losses} · ${rec.pct}` : team.city}</p>
        </div>
      </div>
    </Link>
  );
}

export function TeamsPage() {
  const [params, setParams] = useSearchParams();
  const league = params.get('liga') ?? 'all';
  const list = TEAMS.filter((t) => league === 'all' || t.league === league);
  return (
    <div>
      <PageHeader eyebrow="LIDOM · LNB · Voleibol · Verano" title="Equipos" />
      <div className="mb-6"><Chips label="Liga" options={LEAGUES} value={league} onChange={(id) => setParams(id === 'all' ? {} : { liga: id })} /></div>
      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <TeamCard key={t.slug} team={t} />)}</div>
      ) : <EmptyState title="Sin equipos" />}
    </div>
  );
}

export function TeamDetail() {
  const { slug } = useParams();
  const team = getTeam(slug);
  if (!team) return <EmptyState title="Equipo no encontrado" action={<Link to="/equipos" className="btn-primary">Ver equipos</Link>} />;
  const rec = recordOf(slug);
  const stadium = getStadium(team.stadium);
  const games = gamesForTeam(slug);
  const recent = games.filter(isFinal).slice(-3).reverse();
  const next = games.filter((g) => g.status === 'scheduled' && dayOf(g) >= TODAY).slice(0, 3);
  const videos = VIDEOS.filter((v) => v.teams.includes(slug));
  const products = CATALOG.filter((p) => p.team === slug).slice(0, 4);

  return (
    <div className="flex flex-col gap-12">
      <Link to="/equipos" className="text-sm font-semibold text-flag-soft">← Equipos</Link>
      <section className="relative overflow-hidden rounded-3xl">
        <Img src={team.image} alt={team.name} className="h-72 w-full sm:h-96" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-night via-night/60 to-transparent p-6 sm:p-10">
          <div className="flex flex-wrap items-end gap-5">
            {team.logo && <TeamLogo team={team} size={96} />}
            <div>
              <h1 className="h-display text-5xl sm:text-7xl">{team.name}</h1>
              <p className="mt-2 font-mono text-sm text-muted">
                {team.city}{team.founded ? ` · Fundado en ${team.founded}` : ''}{rec ? ` · ${rec.wins}-${rec.losses} (${rec.pct})` : ''}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-10">
        <section className="flex min-w-0 flex-[999_1_520px] flex-col gap-4 text-[15px] leading-relaxed text-muted">
          <h2 className="h-section text-chalk">Historia</h2>
          {team.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
          {team.sourceUrl && <a href={team.sourceUrl} target="_blank" rel="noreferrer" className="text-sm text-flag-soft underline">Fuente: pelotainvernal.com</a>}
        </section>
        <aside className="flex flex-[1_1_280px] flex-col gap-4">
          {stadium && (
            <Link to="/estadios" className="card overflow-hidden">
              <Img src={stadium.image} alt={stadium.name} className="aspect-video w-full" />
              <p className="p-4 text-sm"><span className="block text-xs text-muted">Estadio</span><b>{stadium.name}</b></p>
            </Link>
          )}
          {rec && (
            <div className="card grid grid-cols-2 gap-3 p-4 font-mono text-sm">
              <span className="text-muted">En casa</span><span className="text-right">{rec.homeW}-{rec.homeL}</span>
              <span className="text-muted">De visita</span><span className="text-right">{rec.awayW}-{rec.awayL}</span>
              <span className="text-muted">Juegos detrás</span><span className="text-right">{rec.gb}</span>
            </div>
          )}
        </aside>
      </div>

      {(recent.length > 0 || next.length > 0) && (
        <section>
          <h2 className="h-section mb-4">Partidos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[...recent, ...next].map((g) => <GameCard key={g.id} game={g} />)}</div>
          <Link to={`/partidos?equipo=${slug}`} className="mt-4 inline-block text-sm font-semibold text-flag-soft">Calendario completo →</Link>
        </section>
      )}
      {videos.length > 0 && (
        <section><h2 className="h-section mb-4">Videos</h2><VideoPlayer videos={videos} /></section>
      )}
      {products.length > 0 && (
        <section>
          <h2 className="h-section mb-4">Tienda</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}

export function StandingsPage() {
  return (
    <div>
      <PageHeader eyebrow="Serie regular 2026-27" title="Posiciones" />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="font-mono text-xs text-muted">
            <tr className="text-right"><th className="p-4 text-left">#</th><th className="p-4 text-left">Equipo</th><th className="p-4">G</th><th className="p-4">P</th><th className="p-4">PCT</th><th className="p-4">JD</th><th className="p-4">Casa</th><th className="p-4">Visita</th></tr>
          </thead>
          <tbody className="font-mono">
            {STANDINGS.map((s, i) => {
              const team = getTeam(s.slug);
              return (
                <tr key={s.slug} className="border-t border-line text-right">
                  <td className="p-4 text-left text-muted">{i + 1}</td>
                  <td className="p-4 text-left font-sans font-semibold"><Link to={`/equipos/${s.slug}`} className="flex items-center gap-3 hover:text-flag-soft">{team && <TeamLogo team={team} size={32} />}{team?.name ?? s.team}</Link></td>
                  <td className="p-4">{s.wins}</td><td className="p-4">{s.losses}</td><td className="p-4">{s.pct}</td><td className="p-4 text-muted">{s.gb}</td>
                  <td className="p-4 text-muted">{s.homeW}-{s.homeL}</td><td className="p-4 text-muted">{s.awayW}-{s.awayL}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">LNB, voleibol y Liga de Verano: no encontramos una fuente pública de posiciones; se mostrarán cuando haya una.</p>
    </div>
  );
}
