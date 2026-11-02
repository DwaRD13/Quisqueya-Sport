import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Check, Download } from 'lucide-react';
import Invoice from './Invoice.jsx';
import { EmptyState, Field, Img, PageHeader, inputClass, money } from '../../shared/ui.jsx';
import { TEAMS, getTeam } from '../../data/catalog.js';
import { getPlan } from '../../data/plans.js';
import { getOrder, orderStatus, ordersFor } from '../../services/orderService.js';
import { cancel, passesFor } from '../../services/subscriptionService.js';
import { getGame, formatDay, gamesForTeam, TODAY, dayOf } from '../games/games.js';
import GameCard from '../games/GameCard.jsx';
import { useAuth } from './auth.jsx';

const date = (iso) => new Date(iso).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' });
const PAY = (p) => (p.method === 'cash' ? 'Pago al retirar' : `${p.brand} •••• ${p.last4}`);

// Re-render every 30s so simulated order status advances on screen.
function useTick() {
  const [, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((t) => t + 1), 30000); return () => clearInterval(id); }, []);
}

function Profile() {
  const auth = useAuth();
  const [form, setForm] = useState({ name: auth.user.name, phone: auth.user.phone, favoriteTeam: auth.user.favoriteTeam ?? '' });
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    try { await auth.updateProfile(form); setMsg({ ok: true, text: 'Perfil actualizado.' }); } catch (err) { setMsg({ ok: false, text: err.message }); }
  };
  return (
    <form onSubmit={submit} noValidate className="card flex flex-col gap-4 p-6">
      <h2 className="font-display text-2xl font-bold uppercase">Perfil</h2>
      <Field label="Nombre"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></Field>
      <Field label="Correo" hint="El correo no se puede cambiar."><input value={auth.user.email} disabled className={`${inputClass} opacity-60`} /></Field>
      <Field label="Teléfono"><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></Field>
      <Field label="Equipo favorito">
        <select value={form.favoriteTeam} onChange={(e) => setForm({ ...form, favoriteTeam: e.target.value })} className={inputClass}>
          <option value="">Ninguno</option>
          {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
        </select>
      </Field>
      {msg && <p role="status" className={`text-sm font-semibold ${msg.ok ? 'text-lights' : 'text-red-soft'}`}>{msg.text}</p>}
      <button type="submit" className="btn-ghost">Guardar cambios</button>
    </form>
  );
}

function PlanCard() {
  const auth = useAuth();
  const plan = auth.subscription && getPlan(auth.subscription.planId);
  const passes = passesFor(auth.user.id).filter((p) => new Date(p.expiresAt) > new Date());
  return (
    <div className="card flex flex-col gap-3 p-6">
      <h2 className="font-display text-2xl font-bold uppercase">Mi plan</h2>
      {plan ? (
        <>
          <p><b>{plan.name}</b> · {money(plan.price)}/{plan.period}</p>
          <p className="text-sm text-muted">Se renueva el {date(auth.subscription.renewsAt)} · {PAY(auth.subscription.payment)}</p>
          {plan.id === 'vip' && <p className="flex items-center gap-2 text-sm text-lights"><Check size={16} aria-hidden="true" /> 10% de descuento activo en la tienda</p>}
          <div className="flex flex-wrap gap-2">
            <Link to="/planes" className="btn-ghost">Cambiar plan</Link>
            <button type="button" onClick={async () => { if (window.confirm('¿Cancelar tu plan? Pierdes los beneficios de inmediato.')) { await cancel(auth.user.id); auth.refresh(); } }} className="btn text-red-soft">Cancelar plan</button>
          </div>
        </>
      ) : (
        <><p className="text-sm text-muted">No tienes un plan activo.</p><Link to="/planes" className="btn-primary self-start">Ver planes</Link></>
      )}
      {passes.map((p) => {
        const g = getGame(p.gameId);
        return <p key={p.id} className="rounded-xl bg-night p-3 text-sm">Pase activo: {g ? `${g.away.name} en ${g.home.name}, ${formatDay(g.date)}` : 'partido'} · vence {new Date(p.expiresAt).toLocaleString('es-DO')}</p>;
      })}
    </div>
  );
}

export function AccountPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  useTick();
  const orders = ordersFor(auth.user.id);
  const team = getTeam(auth.user.favoriteTeam);
  return (
    <div>
      <PageHeader eyebrow={team ? team.name.toUpperCase() : 'MI CUENTA'} title={`Hola, ${auth.user.name.split(' ')[0]}`}>
        <button type="button" onClick={() => { auth.logout(); navigate('/'); }} className="self-start text-sm font-semibold text-flag-soft">Cerrar sesión</button>
      </PageHeader>
      {team && (() => {
        const next = gamesForTeam(team.slug).filter((g) => g.status === 'scheduled' && dayOf(g) >= TODAY).slice(0, 3);
        return next.length > 0 && (
          <section className="mb-8">
            <h2 className="h-section mb-3">Próximos de {team.short}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{next.map((g) => <GameCard key={g.id} game={g} />)}</div>
          </section>
        );
      })()}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-3">
          <h2 className="h-section">Pedidos</h2>
          {orders.length === 0 ? (
            <EmptyState title="Aún no tienes pedidos" action={<Link to="/tienda" className="btn-primary">Ir a la tienda</Link>} />
          ) : orders.map((o) => (
            <Link key={o.id} to={`/pedido/${o.id}`} className="card flex flex-wrap items-center justify-between gap-3 p-4 hover:ring-1 hover:ring-edge">
              <span><b className="font-mono">{o.id}</b><span className="block text-xs text-muted">{date(o.createdAt)} · {o.lines.reduce((n, l) => n + l.qty, 0)} artículos</span></span>
              <span className="tag bg-line">{orderStatus(o).label.toUpperCase()}</span>
              <span className="font-mono font-bold">{money(o.quote.total)}</span>
            </Link>
          ))}
        </section>
        <div className="flex flex-col gap-6"><PlanCard /><Profile /></div>
      </div>
    </div>
  );
}

export function OrderPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();
  useTick();
  const order = getOrder(id);
  // Guest orders are reachable by their link; account orders only by their owner.
  if (!order || (order.userId && order.userId !== user?.id)) {
    return <EmptyState title="Pedido no encontrado" body="Si es de tu cuenta, ingresa para verlo." action={<Link to="/cuenta" className="btn-primary">Mi cuenta</Link>} />;
  }
  const status = orderStatus(order);
  const d = order.delivery;
  // The browser's print dialog saves the PDF; the document title becomes its file name.
  const downloadPdf = () => {
    const title = document.title;
    document.title = `Factura-${order.id}`;
    window.print();
    document.title = title;
  };
  return (
    <>
    <Invoice order={order} />
    <div className="mx-auto flex max-w-3xl flex-col gap-6 print:hidden">
      {params.get('nuevo') && <p role="status" className="tag self-start bg-lights text-night">¡PEDIDO CONFIRMADO! TE ENVIAMOS EL RECIBO A {order.contact.email.toUpperCase()}</p>}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="font-mono text-xs text-muted">PEDIDO</p><h1 className="font-mono text-4xl font-bold">{order.id}</h1></div>
        <button type="button" onClick={downloadPdf} className="btn-ghost"><Download size={16} aria-hidden="true" /> Descargar factura (PDF)</button>
      </div>
      <ol className="card grid gap-2 p-5 sm:grid-flow-col" aria-label="Estado del pedido">
        {status.steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 text-sm font-semibold ${i <= status.index ? 'text-chalk' : 'text-faint'}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${i <= status.index ? 'bg-red text-white' : 'bg-line'}`}>{i < status.index ? <Check size={14} /> : i + 1}</span>{s}
          </li>
        ))}
      </ol>
      <div className="card p-5 text-sm">
        <h2 className="mb-2 font-display text-xl font-bold uppercase">Entrega</h2>
        {d.mode === 'digital' && <p>Boletas digitales enviadas a {order.contact.email}. Presenta el código <b className="font-mono">{order.id}</b> en la puerta.</p>}
        {d.mode === 'pickup' && <p>Retiro en la tienda del <b>{d.stadium}</b>. Presenta el código <b className="font-mono">{order.id}</b>.</p>}
        {d.mode === 'seat' && <p>Entrega en <b>{d.seat}</b>, {d.stadium}.</p>}
        {d.mode === 'home' && <p>Envío a {d.address.street}, {d.address.city}, {d.address.province}.</p>}
        <p className="mt-2 text-muted">{order.contact.name} · {order.contact.phone} · {PAY(order.payment)}{order.payment.authCode ? ` · Autorización ${order.payment.authCode}` : ''}</p>
      </div>
      <div className="card p-5">
        <ul className="flex flex-col gap-3">
          {order.lines.map((l) => (
            <li key={`${l.id}-${l.size}`} className="flex items-center gap-3 text-sm">
              <span className="shrink-0 overflow-hidden rounded-lg bg-white"><Img src={l.image} alt="" fit="contain" className="h-14 w-14 p-0.5" /></span>
              <span className="flex-1">{l.name}<span className="block text-xs text-muted">{l.qty} × {money(l.price)}{l.size ? ` · ${l.size}` : ''}</span></span>
              <span className="font-mono">{money(l.qty * l.price)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-1 border-t border-line pt-3 font-mono text-sm">
          <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(order.quote.subtotal)}</dd></div>
          {order.quote.discount > 0 && <div className="flex justify-between text-lights"><dt>Descuento VIP</dt><dd>−{money(order.quote.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Entrega</dt><dd>{order.quote.shipping ? money(order.quote.shipping) : 'Gratis'}</dd></div>
          <div className="flex justify-between text-xs text-muted"><dt>ITBIS incluido</dt><dd>{money(order.quote.itbis)}</dd></div>
          <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{money(order.quote.total)}</dd></div>
        </dl>
      </div>
      <Link to="/tienda" className="btn-primary self-start">Seguir comprando</Link>
    </div>
    </>
  );
}
