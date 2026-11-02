import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState, Field, Img, inputClass, money } from '../../shared/ui.jsx';
import { STADIUMS } from '../../data/catalog.js';
import { useCart } from '../store/cart.jsx';
import { isVip, useAuth } from '../account/auth.jsx';
import { EMAIL_RE, PHONE_RE } from '../../services/authService.js';
import { PROVINCES, FREE_SHIPPING_FROM, deliveryModes, quote } from '../../services/pricing.js';
import { placeOrder } from '../../services/orderService.js';
import PaymentForm from './PaymentForm.jsx';

const PICKUP = STADIUMS.filter((s) => s.league === 'lidom');
const MODE_LABEL = {
  pickup: ['Retiro en estadio', 'Gratis · listo en la ventanilla de la tienda'],
  seat: ['Entrega en tu asiento', 'RD$ 100 · solo comida y boletas'],
  home: ['Envío a domicilio', `Según provincia · gratis desde RD$ ${FREE_SHIPPING_FROM.toLocaleString('es-DO')}`],
  digital: ['Boletas digitales', 'Te enviamos el código QR al correo'],
};

export function Summary({ lines, totals, vip }) {
  return (
    <aside className="card flex flex-col gap-3 self-start p-5 text-sm">
      <h2 className="font-display text-2xl font-bold uppercase">Resumen</h2>
      <ul className="flex flex-col gap-3">
        {lines.map(({ id, size, qty, product }) => (
          <li key={`${id}-${size}`} className="flex items-center gap-3">
            <span className="shrink-0 overflow-hidden rounded-lg bg-white"><Img src={product.image} alt="" fit="contain" className="h-12 w-12 p-0.5" /></span>
            <span className="min-w-0 flex-1"><span className="block truncate">{product.name}</span><span className="text-xs text-muted">{qty} × {money(product.price)}{size ? ` · ${size}` : ''}</span></span>
          </li>
        ))}
      </ul>
      <dl className="flex flex-col gap-1 border-t border-line pt-3 font-mono">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
        {totals.discount > 0 && <div className="flex justify-between text-lights"><dt>Descuento VIP 10%</dt><dd>−{money(totals.discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted">Entrega</dt><dd>{totals.shipping ? money(totals.shipping) : 'Gratis'}</dd></div>
        <div className="flex justify-between text-xs text-muted"><dt>ITBIS incluido (18%)</dt><dd>{money(totals.itbis)}</dd></div>
        <div className="mt-2 flex justify-between text-lg font-bold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
      </dl>
      {!vip && <p className="text-xs text-muted">Con el plan <Link to="/planes" className="text-flag-soft underline">Fanático VIP</Link> te ahorras 10% en mercancía y comida.</p>}
    </aside>
  );
}

export default function CheckoutPage() {
  const cart = useCart();
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const vip = isVip(subscription);
  const modes = useMemo(() => deliveryModes(cart.items), [cart.items]);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '',
    mode: modes[0], stadium: PICKUP[0].id, seat: '', street: '', city: '', province: 'dn',
  });
  const [errors, setErrors] = useState({});
  const [orderError, setOrderError] = useState('');

  if (!cart.items.length) {
    return <EmptyState title="No hay nada que pagar" body="Tu carrito está vacío." action={<Link to="/tienda" className="btn-primary">Ir a la tienda</Link>} />;
  }

  const mode = modes.includes(form.mode) ? form.mode : modes[0];
  const totals = quote(cart.items, { delivery: mode, province: form.province, vip });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validateDelivery = () => {
    const found = {};
    if (form.name.trim().length < 2) found.name = 'Escribe tu nombre.';
    if (!EMAIL_RE.test(form.email.trim())) found.email = 'Escribe un correo válido.';
    if (!PHONE_RE.test(form.phone.trim())) found.phone = 'Usa un teléfono dominicano, ej. 809-555-1234.';
    if (mode === 'seat' && form.seat.trim().length < 3) found.seat = 'Indica sección, fila y asiento.';
    if (mode === 'home' && form.street.trim().length < 5) found.street = 'Escribe la dirección completa.';
    if (mode === 'home' && form.city.trim().length < 2) found.city = 'Escribe el sector o ciudad.';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const finish = async (payment) => {
    setOrderError('');
    const delivery = { mode, stadium: ['pickup', 'seat'].includes(mode) ? PICKUP.find((s) => s.id === form.stadium).name : null, seat: mode === 'seat' ? form.seat.trim() : null, address: mode === 'home' ? { street: form.street.trim(), city: form.city.trim(), province: PROVINCES.find((p) => p.id === form.province).label } : null };
    try {
      const order = await placeOrder({ userId: user?.id, contact: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() }, lines: cart.items, delivery, quote: totals, payment });
      cart.clear();
      navigate(`/pedido/${order.id}?nuevo=1`, { replace: true });
    } catch (err) {
      // Payment was simulated as approved but stock ran out: tell the user, nothing is kept.
      setOrderError(err.message);
      setStep(1);
    }
  };

  return (
    <div>
      <h1 className="h-display mb-2 text-5xl sm:text-6xl">Pagar</h1>
      <ol className="mb-8 flex gap-4 font-mono text-xs font-bold text-muted" aria-label="Pasos">
        {['Entrega', 'Pago', 'Confirmación'].map((s, i) => <li key={s} aria-current={step === i + 1 ? 'step' : undefined} className={step === i + 1 ? 'text-red' : ''}>{i + 1}. {s.toUpperCase()}</li>)}
      </ol>
      {!user && step === 1 && (
        <p className="card mb-6 p-4 text-sm text-muted">Compras como invitado. <Link to="/ingresar" state={{ from: '/checkout' }} className="font-semibold text-flag-soft">Ingresa</Link> o <Link to="/registro" state={{ from: '/checkout' }} className="font-semibold text-flag-soft">crea una cuenta</Link> para guardar tus pedidos.</p>
      )}
      {orderError && <p role="alert" className="mb-6 rounded-xl bg-red/15 p-4 text-sm font-semibold text-red-soft">{orderError}</p>}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          {step === 1 ? (
            <form noValidate onSubmit={(e) => { e.preventDefault(); if (validateDelivery()) setStep(2); }} className="flex flex-col gap-5">
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 font-display text-2xl font-bold uppercase">Entrega</legend>
                {modes.map((m) => (
                  <label key={m} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${mode === m ? 'border-red bg-red/10' : 'border-edge'}`}>
                    <input type="radio" name="mode" value={m} checked={mode === m} onChange={set('mode')} className="mt-1 accent-[#E63946]" />
                    <span><b className="block">{MODE_LABEL[m][0]}</b><span className="text-sm text-muted">{MODE_LABEL[m][1]}</span></span>
                  </label>
                ))}
              </fieldset>
              {(mode === 'pickup' || mode === 'seat') && (
                <Field label="Estadio"><select value={form.stadium} onChange={set('stadium')} className={inputClass}>{PICKUP.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
              )}
              {mode === 'seat' && <Field label="Asiento" error={errors.seat}><input placeholder="Palco A · Fila 4 · Asiento 12" value={form.seat} onChange={set('seat')} aria-invalid={!!errors.seat} className={inputClass} /></Field>}
              {mode === 'home' && (
                <>
                  <Field label="Dirección" error={errors.street}><input autoComplete="street-address" value={form.street} onChange={set('street')} aria-invalid={!!errors.street} className={inputClass} /></Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Sector / ciudad" error={errors.city}><input value={form.city} onChange={set('city')} aria-invalid={!!errors.city} className={inputClass} /></Field>
                    <Field label="Provincia"><select value={form.province} onChange={set('province')} className={inputClass}>{PROVINCES.map((p) => <option key={p.id} value={p.id}>{p.label} · {money(p.fee)}</option>)}</select></Field>
                  </div>
                </>
              )}
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 font-display text-2xl font-bold uppercase">Contacto</legend>
                <Field label="Nombre" error={errors.name}><input autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} className={inputClass} /></Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Correo" error={errors.email}><input type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} className={inputClass} /></Field>
                  <Field label="Teléfono" error={errors.phone}><input type="tel" autoComplete="tel" placeholder="809-555-1234" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} className={inputClass} /></Field>
                </div>
              </fieldset>
              <button type="submit" className="btn-primary">Continuar al pago</button>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold uppercase">Pago</h2>
                <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-flag-soft">← Cambiar entrega</button>
              </div>
              <PaymentForm amount={totals.total} submitLabel="Pagar" allowCash={mode === 'pickup'} onPaid={finish} onCash={() => finish({ method: 'cash' })} />
            </div>
          )}
        </div>
        <Summary lines={cart.items} totals={totals} vip={vip} />
      </div>
    </div>
  );
}
