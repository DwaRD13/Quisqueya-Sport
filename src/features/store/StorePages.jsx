import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Chips, EmptyState, Img, PageHeader, money } from '../../shared/ui.jsx';
import { TEAMS, getTeam } from '../../data/catalog.js';
import { FOOD_PRICE_NOTE } from '../../data/food.js';
import { stockOf } from '../../services/orderService.js';
import { quote } from '../../services/pricing.js';
import { isVip, useAuth } from '../account/auth.jsx';
import { Summary } from '../checkout/CheckoutPage.jsx';
import { CATALOG, getProduct, useCart } from './cart.jsx';
import ProductCard from './ProductCard.jsx';

const CATEGORIES = [
  { id: 'all', label: 'Todo' },
  { id: 'jersey', label: 'Jerseys' },
  { id: 'cap', label: 'Gorras' },
  { id: 'apparel', label: 'Ropa' },
  { id: 'food', label: 'Comida del estadio' },
  { id: 'tickets', label: 'Boletas' },
];
const SORTS = { relevance: 'Destacados', 'price-asc': 'Precio: menor a mayor', 'price-desc': 'Precio: mayor a menor' };
const TEAM_OPTIONS = [...TEAMS.filter((t) => CATALOG.some((p) => p.team === t.slug)), { slug: 'republica-dominicana', name: 'República Dominicana' }];

export function StorePage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('cat') ?? 'all';
  const team = params.get('equipo') ?? '';
  const sort = params.get('orden') ?? 'relevance';
  const q = params.get('q') ?? '';

  const set = (key, value, fallback = '') => {
    const next = new URLSearchParams(params);
    if (value && value !== fallback) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = CATALOG.filter((p) =>
      (category === 'all' || p.category === category)
      && (!team || p.team === team)
      && (!needle || p.name.toLowerCase().includes(needle) || (getTeam(p.team)?.name ?? '').toLowerCase().includes(needle)));
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') out.sort((a, b) => b.price - a.price);
    return out;
  }, [category, team, sort, q]);

  return (
    <div>
      <PageHeader eyebrow="Mercancía oficial y boletas" title="Tienda">
        <p className="max-w-2xl text-sm text-muted">Mercancía con precios reales en RD$ (Peligro Sports), boletas oficiales 2026-27 del Escogido y comida del estadio con precios simulados. Retiro en el estadio, entrega en tu asiento o envío a domicilio.</p>
      </PageHeader>
      <div className="mb-6 flex flex-col gap-4">
        <Chips label="Categoría" options={CATEGORIES} value={category} onChange={(id) => set('cat', id, 'all')} />
        <div className="flex flex-wrap gap-3">
          <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-xs font-semibold text-muted">
            Buscar en la tienda
            <input type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Ej. gorra Licey" className="h-11 rounded-xl border border-edge bg-dugout px-3 text-sm text-chalk placeholder:text-faint" />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
            Equipo
            <select value={team} onChange={(e) => set('equipo', e.target.value)} className="h-11 rounded-xl border border-edge bg-dugout px-3 text-sm text-chalk">
              <option value="">Todos</option>
              {TEAM_OPTIONS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
            Ordenar
            <select value={sort} onChange={(e) => set('orden', e.target.value, 'relevance')} className="h-11 rounded-xl border border-edge bg-dugout px-3 text-sm text-chalk">
              {Object.entries(SORTS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>
      <p className="mb-4 font-mono text-xs text-muted">{list.length} PRODUCTOS</p>
      {list.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <EmptyState title="Nada por aquí" body="Ningún producto coincide. Prueba con otro equipo o categoría." action={<button type="button" onClick={() => setParams({})} className="btn-ghost">Limpiar filtros</button>} />
      )}
    </div>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);
  const cart = useCart();
  const navigate = useNavigate();
  const [size, setSize] = useState('');
  const [error, setError] = useState('');
  if (!product) return <EmptyState title="Producto no encontrado" action={<Link to="/tienda" className="btn-primary">Ir a la tienda</Link>} />;
  const team = getTeam(product.team);
  const related = CATALOG.filter((p) => p.team === product.team && p.id !== product.id).slice(0, 4);

  const add = (goToCart) => {
    if (product.sizes.length && !size) { setError('Elige una opción.'); return; }
    cart.add(product.id, size || null);
    if (goToCart) navigate('/carrito');
    else setError('');
  };

  return (
    <div className="flex flex-col gap-12">
      <Link to="/tienda" className="text-sm font-semibold text-flag-soft">← Tienda</Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white"><Img src={product.image} alt={product.name} fit="contain" className="aspect-square w-full p-4" /></div>
        <div className="flex flex-col gap-5">
          {team && <Link to={`/equipos/${team.slug}`} className="font-mono text-xs font-bold tracking-[2px] text-red">{team.name.toUpperCase()}</Link>}
          <h1 className="font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">{product.name}</h1>
          <p className="font-mono text-3xl font-bold">{money(product.price)}</p>
          {product.sizes.length > 0 && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold text-muted">Opción (color / talla)</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setError(''); }} className={size === s ? 'chip-on' : 'chip-off'}>{s}</button>
                ))}
              </div>
            </fieldset>
          )}
          {error && <p role="alert" className="text-sm font-semibold text-red-soft">{error}</p>}
          {product.inStock && stockOf(product) > 0 ? (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => add(true)} className="btn-primary">Comprar ahora</button>
              <button type="button" onClick={() => add(false)} className="btn-ghost">Agregar al carrito</button>
            </div>
          ) : <p className="font-semibold text-muted">Agotado por ahora.</p>}
          {product.description && <p className="text-muted">{product.description}</p>}
          {product.inStock && <p className="font-mono text-xs text-muted">{stockOf(product) > 0 ? `${stockOf(product)} DISPONIBLES` : 'AGOTADO'}</p>}
          <p className="text-sm text-muted">
            {product.simulatedPrice ? FOOD_PRICE_NOTE : <>Precio y foto de <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="text-flag-soft underline">{product.category === 'tickets' ? 'Revista Mercado' : 'Peligro Sports'}</a>.</>}
            {product.category === 'tickets' ? ' Precio por boleta para juegos del Escogido en el Estadio Quisqueya.' : ''}
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <h2 className="h-section mb-4">Más de {team?.name ?? 'este equipo'}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
    </div>
  );
}

export function CartPage() {
  const cart = useCart();
  const { subscription } = useAuth();
  const vip = isVip(subscription);
  if (!cart.items.length) {
    return <EmptyState title="Tu carrito está vacío" body="Agrega jerseys, gorras, comida o boletas desde la tienda." action={<Link to="/tienda" className="btn-primary">Ir a la tienda</Link>} />;
  }
  const totals = quote(cart.items, { delivery: 'pickup', vip });
  return (
    <div>
      <PageHeader title="Carrito" />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col gap-3">
          {cart.items.map(({ id, size, qty, product }) => {
            const left = stockOf(product);
            return (
              <li key={`${id}-${size}`} className="card flex flex-wrap items-center gap-4 p-3">
                <Link to={`/tienda/${id}`} className="shrink-0 overflow-hidden rounded-xl bg-white"><Img src={product.image} alt={product.name} fit="contain" className="h-20 w-20 p-1" /></Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{product.name}</p>
                  <p className="text-xs text-muted">{size ? `${size} · ` : ''}{money(product.price)}</p>
                  {qty > left && <p className="text-xs font-semibold text-red-soft">Solo quedan {left}.</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Quitar uno" onClick={() => cart.setQty(id, size, qty - 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-line"><Minus size={16} /></button>
                  <span className="w-6 text-center font-mono">{qty}</span>
                  <button type="button" aria-label="Agregar uno" disabled={qty >= left} onClick={() => cart.setQty(id, size, qty + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-line disabled:opacity-40"><Plus size={16} /></button>
                </div>
                <button type="button" aria-label={`Eliminar ${product.name}`} onClick={() => cart.remove(id, size)} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-red-soft"><Trash2 size={18} /></button>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-3">
          <Summary lines={cart.items} totals={totals} vip={vip} />
          <Link to="/checkout" className={`btn-primary ${cart.items.some((l) => l.qty > stockOf(l.product)) ? 'pointer-events-none opacity-50' : ''}`}>Ir a pagar</Link>
          <p className="text-center text-xs text-muted">El costo de entrega se calcula en el siguiente paso.</p>
        </div>
      </div>
    </div>
  );
}
