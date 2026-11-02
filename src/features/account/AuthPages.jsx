import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Field, inputClass } from '../../shared/ui.jsx';
import { TEAMS } from '../../data/catalog.js';
import { validateRegistration } from '../../services/authService.js';
import { useAuth } from './auth.jsx';

// Where to go after auth: the page that sent the user here, else the account.
const useReturnTo = () => useLocation().state?.from ?? '/cuenta';

function AuthShell({ title, children, footer }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <h1 className="h-display text-5xl">{title}</h1>
      <div className="card p-6">{children}</div>
      <p className="text-center text-sm text-muted">{footer}</p>
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname + location.search }} />;
  return children;
}

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const returnTo = useReturnTo();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (auth.user) return <Navigate to={returnTo} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await auth.login(form.email, form.password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Ingresar" footer={<>¿No tienes cuenta? <Link to="/registro" state={{ from: returnTo }} className="font-semibold text-flag-soft">Crear cuenta</Link></>}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Correo"><input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></Field>
        <Field label="Contraseña"><input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} /></Field>
        {error && <p role="alert" className="text-sm font-semibold text-red-soft">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Ingresando…' : 'Ingresar'}</button>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const returnTo = useReturnTo();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', favoriteTeam: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  if (auth.user) return <Navigate to={returnTo} replace />;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const found = validateRegistration(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      await auth.register(form);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrors({ [err.field ?? 'form']: err.message });
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Crear cuenta" footer={<>¿Ya tienes cuenta? <Link to="/ingresar" state={{ from: returnTo }} className="font-semibold text-flag-soft">Ingresar</Link></>}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Nombre completo" error={errors.name}><input autoComplete="name" value={form.name} onChange={set('name')} aria-invalid={!!errors.name} className={inputClass} /></Field>
        <Field label="Correo" error={errors.email}><input type="email" autoComplete="email" value={form.email} onChange={set('email')} aria-invalid={!!errors.email} className={inputClass} /></Field>
        <Field label="Teléfono" error={errors.phone}><input type="tel" autoComplete="tel" placeholder="809-555-1234" value={form.phone} onChange={set('phone')} aria-invalid={!!errors.phone} className={inputClass} /></Field>
        <Field label="Contraseña" error={errors.password} hint="Mínimo 8 caracteres, con letras y números."><input type="password" autoComplete="new-password" value={form.password} onChange={set('password')} aria-invalid={!!errors.password} className={inputClass} /></Field>
        <Field label="Equipo favorito (opcional)">
          <select value={form.favoriteTeam} onChange={set('favoriteTeam')} className={inputClass}>
            <option value="">Ninguno</option>
            {TEAMS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </Field>
        {errors.form && <p role="alert" className="text-sm font-semibold text-red-soft">{errors.form}</p>}
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">{busy ? 'Creando cuenta…' : 'Crear cuenta'}</button>
        <p className="text-xs text-muted">Demo: la cuenta se guarda solo en este navegador.</p>
      </form>
    </AuthShell>
  );
}
