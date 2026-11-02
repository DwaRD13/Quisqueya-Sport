import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState, PageHeader } from '../../shared/ui.jsx';
import { TEAMS } from '../../data/catalog.js';
import { VIDEOS } from '../../data/videos.js';
import { GAMES } from '../games/games.js';
import { CATALOG } from '../store/cart.jsx';
import { TeamCard } from '../teams/TeamsPages.jsx';
import ProductCard from '../store/ProductCard.jsx';
import GameCard from '../games/GameCard.jsx';

// Accent-insensitive match so "aguilas" finds "Águilas".
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const n = norm(q.trim());
  const hit = (...fields) => fields.some((f) => f && norm(f).includes(n));

  const teams = n ? TEAMS.filter((t) => hit(t.name, t.city, t.short)) : [];
  const products = n ? CATALOG.filter((p) => hit(p.name)) : [];
  const videos = n ? VIDEOS.filter((v) => hit(v.title, v.channel)) : [];
  const games = n ? GAMES.filter((g) => hit(g.away.name, g.home.name)).slice(-6).reverse() : [];
  const total = teams.length + products.length + videos.length + games.length;

  return (
    <div className="flex flex-col gap-10">
      <PageHeader eyebrow="Búsqueda" title={q ? `“${q}”` : 'Buscar'} />
      {!n && <EmptyState title="¿Qué buscas?" body="Escribe un equipo, jugador o producto en el buscador de arriba." />}
      {n && total === 0 && <EmptyState title="Sin resultados" body="Prueba con el nombre de un equipo, como Licey o Águilas." />}
      {teams.length > 0 && <section><h2 className="h-section mb-4">Equipos</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{teams.map((t) => <TeamCard key={t.slug} team={t} />)}</div></section>}
      {games.length > 0 && <section><h2 className="h-section mb-4">Partidos</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{games.map((g) => <GameCard key={g.id} game={g} />)}</div></section>}
      {videos.length > 0 && (
        <section><h2 className="h-section mb-4">Videos</h2>
          <ul className="flex flex-col gap-2">{videos.map((v) => <li key={v.id}><Link to={v.gameId ? `/partidos/${v.gameId}` : '/videos'} className="text-flag-soft underline">{v.title}</Link></li>)}</ul>
        </section>
      )}
      {products.length > 0 && <section><h2 className="h-section mb-4">Tienda</h2><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div></section>}
    </div>
  );
}
