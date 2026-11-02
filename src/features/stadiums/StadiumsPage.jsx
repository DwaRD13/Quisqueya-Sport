import { Link, useSearchParams } from 'react-router-dom';
import { Chips, EmptyState, Img, PageHeader } from '../../shared/ui.jsx';
import { LEAGUES, STADIUMS, getTeam } from '../../data/catalog.js';

export default function StadiumsPage() {
  const [params, setParams] = useSearchParams();
  const league = params.get('liga') ?? 'all';
  const list = STADIUMS.filter((s) => league === 'all' || s.league === league);
  return (
    <div>
      <PageHeader eyebrow="Dónde se juega" title="Estadios" />
      <div className="mb-6"><Chips label="Liga" options={LEAGUES} value={league} onChange={(id) => setParams(id === 'all' ? {} : { liga: id })} /></div>
      {list.length === 0 && <EmptyState title="Sin estadios" body="No tenemos sedes registradas para esta liga." />}
      <div className="grid gap-5 md:grid-cols-2">
        {list.map((s) => (
          <article key={s.id} className="card overflow-hidden">
            <Img src={s.image} alt={s.name} label={`Sin foto disponible · ${s.name}`} className="aspect-video w-full" />
            <div className="flex flex-col gap-3 p-5">
              <h2 className="font-display text-2xl font-bold uppercase">{s.name}</h2>
              <p className="font-mono text-xs text-muted">{s.city.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2">
                {s.teams.map((slug) => {
                  const t = getTeam(slug);
                  return t && <Link key={slug} to={`/equipos/${slug}`} className="chip-off">{t.name}</Link>;
                })}
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.name}, ${s.city}, República Dominicana`)}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-flag-soft">Cómo llegar →</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
