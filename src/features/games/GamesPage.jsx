import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Chips, EmptyState, PageHeader } from '../../shared/ui.jsx';
import GameCard from './GameCard.jsx';
import { GAMES, SNAPSHOT, TODAY, dayOf, formatDay } from './games.js';
import { TEAMS } from '../../data/catalog.js';

const VIEWS = [
  { id: 'results', label: 'Resultados' },
  { id: 'today', label: 'Hoy' },
  { id: 'upcoming', label: 'Calendario' },
];
const LIDOM = TEAMS.filter((t) => t.league === 'lidom');

export default function GamesPage() {
  const [params, setParams] = useSearchParams();
  const view = params.get('vista') ?? 'results';
  const team = params.get('equipo') ?? '';
  const month = params.get('mes') ?? '';

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const months = useMemo(() => [...new Set(GAMES.map((g) => g.date.slice(0, 7)))], []);

  const games = useMemo(() => {
    let list = GAMES.filter((g) => {
      if (view === 'results') return g.status === 'final' || g.status === 'postponed';
      if (view === 'today') return dayOf(g) === TODAY;
      return dayOf(g) > TODAY;
    });
    if (team) list = list.filter((g) => g.away.slug === team || g.home.slug === team);
    if (month) list = list.filter((g) => g.date.startsWith(month));
    return view === 'results' ? [...list].reverse() : list;
  }, [view, team, month]);

  // Group by day for scannable sections.
  const days = useMemo(() => {
    const map = new Map();
    for (const g of games) map.set(dayOf(g), [...(map.get(dayOf(g)) ?? []), g]);
    return [...map.entries()];
  }, [games]);

  return (
    <div>
      <PageHeader eyebrow="LIDOM 2026-27" title="Partidos">
        <p className="text-sm text-muted">
          Datos de <a className="text-flag-soft underline" href={SNAPSHOT.source} target="_blank" rel="noreferrer">pelotainvernal.com</a> · actualizado {formatDay(SNAPSHOT.fetchedAt)}
        </p>
      </PageHeader>

      <div className="mb-8 flex flex-col gap-4">
        <Chips label="Vista" options={VIEWS} value={view} onChange={(v) => set('vista', v === 'results' ? '' : v)} />
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
            Equipo
            <select value={team} onChange={(e) => set('equipo', e.target.value)} className="h-11 rounded-xl border border-edge bg-dugout px-3 text-sm text-chalk">
              <option value="">Todos los equipos</option>
              {LIDOM.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
            Mes
            <select value={month} onChange={(e) => set('mes', e.target.value)} className="h-11 rounded-xl border border-edge bg-dugout px-3 text-sm text-chalk">
              <option value="">Toda la temporada</option>
              {months.map((m) => <option key={m} value={m}>{formatDay(`${m}-01`).split(' ').slice(1).join(' ')}</option>)}
            </select>
          </label>
          {(team || month) && (
            <button type="button" onClick={() => setParams(view === 'results' ? {} : { vista: view })} className="self-end text-sm font-semibold text-flag-soft">Limpiar filtros</button>
          )}
        </div>
      </div>

      {days.length === 0 ? (
        <EmptyState title="Sin partidos" body={view === 'today' ? 'No hay juegos programados para hoy.' : 'Ningún partido coincide con estos filtros.'} />
      ) : (
        <div className="flex flex-col gap-8">
          {days.map(([day, list]) => (
            <section key={day}>
              <h2 className="mb-3 font-mono text-sm font-bold text-muted">{formatDay(day).toUpperCase()}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((g) => <GameCard key={g.id} game={g} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
