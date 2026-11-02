import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Chips, EmptyState, Img, PageHeader, money } from '../../shared/ui.jsx';
import { TEAMS, STADIUMS, TICKETS_SOURCE, getTeam } from '../../data/catalog.js';
import { CATALOG, getProduct, useCart } from './cart.jsx';
import ProductCard from './ProductCard.jsx';

const CATEGORIES = [
  { id: 'all', label: 'Todo' },
  { id: 'jersey', label: 'Jerseys' },
  { id: 'cap', label: 'Gorras' },
  { id: 'apparel', label: 'Ropa' },
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
        <p className="max-w-2xl text-sm text-muted">Precios reales en RD$ de Peligro Sports y de las boletas 2026-27 del Escogido publicadas por Revista Mercado. Reservas para retirar en el estadio.</p>
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
          {product.inStock ? (
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => add(true)} className="btn-primary">Reservar y retirar</button>
              <button type="button" onClick={() => add(false)} className="btn-ghost">Agregar al carrito</button>
            </div>
          ) : <p className="font-semibold text-muted">Agotado por ahora.</p>}
          <p className="text-sm text-muted">
            Precio y foto de <a href={product.sourceUrl} target="_blank" rel="noreferrer" className="text-flag-soft underline">{product.category === 'tickets' ? 'Revista Mercado' : 'Peligro Sports'}</a>.
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

const PICKUP = STADIUMS.filter((s) => s.league === 'lidom');

export function CartPage() {
  const cart = useCart();
  const [form, setForm] = useState({ name: '', phone: '', stadium: PICKUP[0].id });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  if (order) {
    return (
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-4 p-10 text-center">
        <span className="tag bg-lights text-night">RESERVA CONFIRMADA</span>
        <p className="font-mono text-4xl font-bold">{order.code}</p>
        <p className="text-muted">{order.name}, presenta este código en la tienda del {order.stadium}. Pagas al retirar: {money(order.total)}.</p>
        <Link to="/tienda" className="btn-primary">Seguir comprando</Link>
      </div>
    );
  }

  if (!cart.items.length) {
    return <EmptyState title="Tu carrito está vacío" body="Agrega jerseys, gorras o boletas desde la tienda." action={<Link to="/tienda" className="btn-primary">Ir a la tienda</Link>} />;
  }

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Escribe tu nombre.';
    if (!/^\+?1?\s?\(?8[024]9\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(form.phone.trim())) next.phone = 'Usa un teléfono dominicano, ej. 809-555-1234.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const code = `QS-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    setOrder({ code, name: form.name.trim(), stadium: PICKUP.find((s) => s.id === form.stadium).name, total: cart.total });
    cart.clear();
  };

  return (
    <div>
      <PageHeader title="Carrito" />
      <div className="flex flex-wrap gap-8">
        <ul className="flex min-w-0 flex-[999_1_520px] flex-col gap-3">
          {cart.items.map(({ id, size, qty, product }) => (
            <li key={`${id}-${size}`} className="card flex items-center gap-4 p-3">
              <Link to={`/tienda/${id}`} className="shrink-0 overflow-hidden rounded-xl bg-white"><Img src={product.image} alt={product.name} fit="contain" className="h-20 w-20 p-1" /></Link>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{product.name}</p>
                <p className="text-xs text-muted">{size ? `${size} · ` : ''}{money(product.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Quitar uno" onClick={() => cart.setQty(id, size, qty - 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-line"><Minus size={16} /></button>
                <span className="w-6 text-center font-mono">{qty}</span>
                <button type="button" aria-label="Agregar uno" onClick={() => cart.setQty(id, size, qty + 1)} className="flex h-11 w-11 items-center justify-center rounded-full bg-line"><Plus size={16} /></button>
              </div>
              <button type="button" aria-label={`Eliminar ${product.name}`} onClick={() => cart.remove(id, size)} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:text-red-soft"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
        <form onSubmit={submit} noValidate className="card flex flex-[1_1_300px] flex-col gap-4 self-start p-6">
          <h2 className="font-display text-2xl font-bold uppercase">Retiro en estadio</h2>
          <label className="flex flex-col gap-1 text-sm font-semibold">Nombre
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} className="h-11 rounded-xl border border-edge bg-night px-3 font-normal" />
            {errors.name && <span className="text-xs text-red-soft">{errors.name}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Teléfono
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone} placeholder="809-555-1234" className="h-11 rounded-xl border border-edge bg-night px-3 font-normal" />
            {errors.phone && <span className="text-xs text-red-soft">{errors.phone}</span>}
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">Estadio de retiro
            <select value={form.stadium} onChange={(e) => setForm({ ...form, stadium: e.target.value })} className="h-11 rounded-xl border border-edge bg-night px-3 font-normal">
              {PICKUP.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <div className="flex items-center justify-between border-t border-line pt-4"><span className="text-muted">Total</span><span className="font-mono text-2xl font-bold">{money(cart.total)}</span></div>
          <button type="submit" className="btn-primary">Confirmar reserva</button>
          <p className="text-xs text-muted">Pagas al retirar. Boletas: precios oficiales del Escogido (<a href={TICKETS_SOURCE} target="_blank" rel="noreferrer" className="underline">fuente</a>).</p>
        </form>
      </div>
    </div>
  );
}
