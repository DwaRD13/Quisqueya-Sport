import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Home, PlayCircle, Search, ShoppingBag, ShoppingCart, UserRound, Users } from 'lucide-react';
import { useAuth } from '../features/account/auth.jsx';
import { useCart } from '../features/store/cart.jsx';
import { SNAPSHOT, formatDay } from '../features/games/games.js';

const NAV = [
  { to: '/partidos', label: 'Partidos' },
  { to: '/posiciones', label: 'Posiciones' },
  { to: '/equipos', label: 'Equipos' },
  { to: '/videos', label: 'Videos' },
  { to: '/tienda', label: 'Tienda' },
  { to: '/estadios', label: 'Estadios' },
  { to: '/planes', label: 'Planes' },
];
const MOBILE = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/partidos', label: 'Partidos', icon: CalendarDays },
  { to: '/videos', label: 'Videos', icon: PlayCircle },
  { to: '/equipos', label: 'Equipos', icon: Users },
  { to: '/tienda', label: 'Tienda', icon: ShoppingBag },
];

function SearchBox({ className = '' }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <form role="search" className={`relative ${className}`} onSubmit={(e) => { e.preventDefault(); navigate(`/buscar?q=${encodeURIComponent(q.trim())}`); }}>
      <label htmlFor="site-search" className="sr-only">Buscar</label>
      <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
      <input id="site-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar equipo, partido o producto" className="h-11 w-full rounded-full border border-edge bg-dugout pl-10 pr-4 text-sm placeholder:text-faint" />
    </form>
  );
}

export default function Layout() {
  const { count } = useCart();
  const { user } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen pb-24 xl:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-flag focus:px-4 focus:py-2">Saltar al contenido</a>
      <header className="sticky top-0 z-40 border-b border-line bg-night/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
          <Link to="/" className="font-display text-2xl font-extrabold uppercase tracking-wide">Quisqueya<span className="text-red">Sport</span></Link>
          <nav aria-label="Principal" className="hidden flex-1 gap-1 xl:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-full px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-line text-chalk' : 'text-muted hover:text-chalk'}`}>{n.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SearchBox className="hidden w-64 md:block xl:w-44" />
            <Link to={user ? '/cuenta' : '/ingresar'} aria-label={user ? `Mi cuenta, ${user.name}` : 'Ingresar'} className="flex h-11 items-center gap-2 rounded-full border border-edge px-3.5 text-sm font-semibold hover:border-muted">
              <UserRound size={18} aria-hidden="true" /><span className="hidden sm:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
            </Link>
            <Link to="/carrito" aria-label={`Carrito, ${count} artículos`} className="flex h-11 min-w-11 items-center gap-1.5 rounded-full bg-red px-3.5 text-sm font-bold text-white">
              <ShoppingCart size={18} aria-hidden="true" />{count}
            </Link>
          </div>
          <SearchBox className="w-full md:hidden" />
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><Outlet /></main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-muted sm:px-6">
          <span>© 2026 Quisqueya Sport · Datos LIDOM: <a className="underline" href={SNAPSHOT.source} target="_blank" rel="noreferrer">pelotainvernal.com</a> ({formatDay(SNAPSHOT.fetchedAt)})</span>
          <nav aria-label="Pie" className="flex flex-wrap gap-4">
            <Link to="/planes" className="hover:text-chalk">Planes</Link>
            <Link to="/ecosistema" className="hover:text-chalk">Ecosistema</Link>
            <Link to="/estadios" className="hover:text-chalk">Estadios</Link>
          </nav>
        </div>
      </footer>

      <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-night/95 backdrop-blur-xl xl:hidden">
        {MOBILE.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${isActive ? 'text-red' : 'text-muted'}`}>
            <Icon size={20} aria-hidden="true" />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
