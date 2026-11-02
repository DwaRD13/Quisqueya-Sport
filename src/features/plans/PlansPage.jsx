import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { EmptyState, Field, PageHeader, inputClass, money } from '../../shared/ui.jsx';
import { SUBSCRIPTION_PLANS, getPlan } from '../../data/plans.js';
import { buyPass, subscribe } from '../../services/subscriptionService.js';
import { GAMES, TODAY, dayOf, formatDay, formatTime } from '../games/games.js';
import { useAuth } from '../account/auth.jsx';
import PaymentForm from '../checkout/PaymentForm.jsx';

export default function PlansPage() {
  const { subscription } = useAuth();
  return (
    <div>
      <PageHeader eyebrow="Suscripciones" title="Planes">
        <p className="max-w-2xl text-sm text-muted">Las transmisiones son una demo; el descuento VIP en la tienda sí se aplica en tus compras.</p>
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((p) => {
          const current = subscription?.planId === p.id;
          return (
            <article key={p.id} className={`card flex flex-col gap-4 p-6 ${p.highlighted ? 'ring-2 ring-red' : ''}`}>
              <span className="tag self-start bg-line">{(current ? 'Tu plan actual' : p.badge).toUpperCase()}</span>
              <h2 className="font-display text-3xl font-bold uppercase">{p.name}</h2>
              <p className="font-mono text-3xl font-bold">{money(p.price)}<span className="text-sm text-muted"> / {p.period}</span></p>
              <p className="text-sm text-muted">{p.description}</p>
              <ul className="flex flex-col gap-2 text-sm">
                {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-lights" aria-hidden="true" />{f}</li>)}
              </ul>
              {current ? (
                <Link to="/cuenta" className="btn-ghost mt-auto">Administrar</Link>
              ) : (
                <Link to={`/planes/${p.id}/pagar`} className={`mt-auto ${p.highlighted ? 'btn-primary' : 'btn-ghost'}`}>{p.kind === 'pass' ? 'Comprar pase' : subscription ? 'Cambiar a este plan' : 'Suscribirme'}</Link>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function PlanCheckoutPage() {
  const { id } = useParams();
  const plan = getPlan(id);
  const auth = useAuth();
  const navigate = useNavigate();
  const upcoming = GAMES.filter((g) => g.status === 'scheduled' && dayOf(g) >= TODAY).slice(0, 12);
  const [gameId, setGameId] = useState(upcoming[0]?.id ?? '');
  if (!plan) return <EmptyState title="Plan no encontrado" action={<Link to="/planes" className="btn-primary">Ver planes</Link>} />;

  const onPaid = async (payment) => {
    if (plan.kind === 'pass') await buyPass(auth.user.id, Number(gameId), payment);
    else await subscribe(auth.user.id, plan, payment);
    auth.refresh();
    navigate('/cuenta', { replace: true });
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_320px]">
      <div className="card flex flex-col gap-5 p-6">
        <h1 className="h-display text-4xl">Pagar {plan.name}</h1>
        {plan.kind === 'pass' && (
          <Field label="Partido">
            <select value={gameId} onChange={(e) => setGameId(e.target.value)} className={inputClass}>
              {upcoming.map((g) => <option key={g.id} value={g.id}>{g.away.name} en {g.home.name} · {formatDay(g.date)} {formatTime(g.date)}</option>)}
            </select>
          </Field>
        )}
        <PaymentForm amount={plan.price} submitLabel={plan.kind === 'pass' ? 'Comprar' : 'Suscribirme por'} onPaid={onPaid} />
      </div>
      <aside className="card flex flex-col gap-3 self-start p-5 text-sm">
        <h2 className="font-display text-2xl font-bold uppercase">{plan.name}</h2>
        <p className="font-mono text-2xl font-bold">{money(plan.price)}<span className="text-sm text-muted"> / {plan.period}</span></p>
        <ul className="flex flex-col gap-2">{plan.features.map((f) => <li key={f} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-lights" aria-hidden="true" />{f}</li>)}</ul>
        {plan.kind === 'subscription' && <p className="text-xs text-muted">Se renueva cada mes (simulado). Puedes cancelar en Mi cuenta.{auth.subscription ? ' Reemplaza tu plan actual.' : ''}</p>}
      </aside>
    </div>
  );
}
