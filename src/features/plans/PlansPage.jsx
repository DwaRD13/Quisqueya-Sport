import { useState } from 'react';
import { Check } from 'lucide-react';
import { PageHeader } from '../../shared/ui.jsx';
import { SUBSCRIPTION_PLANS } from '../../data/plans.js';

const KEY = 'qs-waitlist-v1';

// Streaming plans are a product concept: there is no live billing, so the CTA joins a waitlist.
export default function PlansPage() {
  const [plan, setPlan] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { return null; }
  });

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Escribe un correo válido.'); return; }
    const entry = { plan, email: email.trim() };
    try { localStorage.setItem(KEY, JSON.stringify(entry)); } catch { /* storage unavailable */ }
    setDone(entry);
  };

  return (
    <div>
      <PageHeader eyebrow="Próximamente" title="Planes">
        <p className="max-w-2xl text-sm text-muted">Las transmisiones en vivo aún no están disponibles. Elige un plan y te avisamos cuando abra.</p>
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((p) => (
          <article key={p.id} className={`card flex flex-col gap-4 p-6 ${p.highlighted ? 'ring-2 ring-red' : ''}`}>
            <span className="tag self-start bg-line">{p.badge.toUpperCase()}</span>
            <h2 className="font-display text-3xl font-bold uppercase">{p.name}</h2>
            <p className="text-sm text-muted">{p.description}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-lights" aria-hidden="true" />{f}</li>)}
            </ul>
            <button type="button" onClick={() => { setPlan(p.id); setError(''); }} aria-pressed={plan === p.id} className={`mt-auto ${plan === p.id ? 'btn-primary' : 'btn-ghost'}`}>
              {plan === p.id ? 'Seleccionado' : 'Avisarme de este plan'}
            </button>
          </article>
        ))}
      </div>
      {done ? (
        <p role="status" className="card mt-8 p-6 text-center">Listo: te avisaremos en <b>{done.email}</b> cuando abra el plan.</p>
      ) : plan && (
        <form onSubmit={submit} noValidate className="card mt-8 flex flex-wrap items-end gap-3 p-6">
          <label className="flex min-w-[240px] flex-1 flex-col gap-1 text-sm font-semibold">Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} className="h-12 rounded-xl border border-edge bg-night px-3 font-normal" />
            {error && <span className="text-xs text-red-soft">{error}</span>}
          </label>
          <button type="submit" className="btn-primary">Unirme a la lista</button>
        </form>
      )}
    </div>
  );
}
