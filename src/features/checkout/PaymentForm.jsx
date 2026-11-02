import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Field, inputClass, money } from '../../shared/ui.jsx';
import { TEST_CARDS, cardBrand, charge, formatCard, validateCard } from '../../services/paymentService.js';

// Simulated card form. onPaid receives { brand, last4, authCode }; nothing is stored.
export default function PaymentForm({ amount, onPaid, submitLabel = 'Pagar', allowCash = false, onCash }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState('');
  const [busy, setBusy] = useState(false);
  const brand = cardBrand(card.number);

  const set = (k, fmt = (v) => v) => (e) => setCard({ ...card, [k]: fmt(e.target.value) });
  const expiryFmt = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const submit = async (e) => {
    e.preventDefault();
    setFailure('');
    if (method === 'cash') { setBusy(true); await onCash(); return; }
    const found = validateCard(card);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      const receipt = await charge({ card, amount });
      await onPaid({ method: 'card', ...receipt });
    } catch (err) {
      setFailure(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {allowCash && (
        <div role="radiogroup" aria-label="Método de pago" className="grid grid-cols-2 gap-2">
          {[['card', 'Tarjeta'], ['cash', 'Pagar al retirar']].map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={method === id} onClick={() => setMethod(id)} className={method === id ? 'chip-on justify-center' : 'chip-off justify-center'}>{label}</button>
          ))}
        </div>
      )}
      {method === 'card' && (
        <>
          <Field label="Nombre en la tarjeta" error={errors.name}><input autoComplete="cc-name" value={card.name} onChange={set('name')} aria-invalid={!!errors.name} className={inputClass} /></Field>
          <Field label="Número de tarjeta" error={errors.number} hint={brand ?? undefined}>
            <div className="relative">
              <CreditCard size={18} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={card.number} onChange={set('number', formatCard)} aria-invalid={!!errors.number} className={`${inputClass} w-full pl-10`} />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Vence" error={errors.expiry}><input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.expiry} onChange={set('expiry', expiryFmt)} aria-invalid={!!errors.expiry} className={inputClass} /></Field>
            <Field label="CVV" error={errors.cvc}><input inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={set('cvc', (v) => v.replace(/\D/g, '').slice(0, 4))} aria-invalid={!!errors.cvc} className={inputClass} /></Field>
          </div>
          <details className="rounded-xl bg-night p-3 text-xs text-muted">
            <summary className="cursor-pointer font-semibold text-chalk">Tarjetas de prueba</summary>
            <ul className="mt-2 flex flex-col gap-1 font-mono">
              {TEST_CARDS.map((t) => <li key={t.number}>{t.number} → {t.result}</li>)}
              <li>Cualquier fecha futura y CVV de 3 dígitos.</li>
            </ul>
          </details>
        </>
      )}
      {failure && <p role="alert" className="rounded-xl bg-red/15 p-3 text-sm font-semibold text-red-soft">{failure}</p>}
      <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
        <Lock size={16} aria-hidden="true" />
        {busy ? 'Procesando…' : `${submitLabel} ${money(amount)}`}
      </button>
      <p className="text-center text-xs text-muted">Pago simulado: no se cobra nada ni se guardan datos de tarjeta.</p>
    </form>
  );
}
