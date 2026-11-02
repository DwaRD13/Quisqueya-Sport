import { delay, read, uid, write } from './storage.js';

const USERS = 'qs-users-v1';
const SESSION = 'qs-session-v1';

export const PHONE_RE = /^\+?1?\s?\(?8[024]9\)?[\s-]?\d{3}[\s-]?\d{4}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthError extends Error {
  constructor(field, message) { super(message); this.field = field; }
}

// Demo-only: hashing in the browser is not real security, it just avoids storing plain text.
async function hash(password, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const publicUser = ({ passwordHash, salt, ...user }) => user;
const users = () => read(USERS, []);

export function validateRegistration({ name, email, phone, password }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Escribe tu nombre completo.';
  if (!EMAIL_RE.test(email?.trim() ?? '')) errors.email = 'Escribe un correo válido.';
  if (!PHONE_RE.test(phone?.trim() ?? '')) errors.phone = 'Usa un teléfono dominicano, ej. 809-555-1234.';
  if (!password || password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
    errors.password = 'Mínimo 8 caracteres, con letras y números.';
  }
  return errors;
}

export async function register(input) {
  await delay(600);
  const errors = validateRegistration(input);
  const field = Object.keys(errors)[0];
  if (field) throw new AuthError(field, errors[field]);
  const email = input.email.trim().toLowerCase();
  if (users().some((u) => u.email === email)) throw new AuthError('email', 'Ya existe una cuenta con este correo.');
  const salt = uid('S');
  const user = {
    id: uid('U'),
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    favoriteTeam: input.favoriteTeam || null,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hash(input.password, salt),
  };
  write(USERS, [...users(), user]);
  write(SESSION, { userId: user.id });
  return publicUser(user);
}

export async function login(email, password) {
  await delay(500);
  const user = users().find((u) => u.email === (email ?? '').trim().toLowerCase());
  if (!user || user.passwordHash !== await hash(password ?? '', user.salt)) {
    throw new AuthError('password', 'Correo o contraseña incorrectos.');
  }
  write(SESSION, { userId: user.id });
  return publicUser(user);
}

export function logout() {
  write(SESSION, null);
}

export function currentUser() {
  const session = read(SESSION, null);
  const user = session && users().find((u) => u.id === session.userId);
  return user ? publicUser(user) : null;
}

export async function updateProfile(id, changes) {
  await delay(400);
  const all = users();
  const user = all.find((u) => u.id === id);
  if (!user) throw new AuthError('form', 'Sesión expirada. Vuelve a ingresar.');
  const next = { ...user, name: changes.name?.trim() ?? user.name, phone: changes.phone?.trim() ?? user.phone, favoriteTeam: changes.favoriteTeam ?? user.favoriteTeam };
  if (next.name.length < 2) throw new AuthError('name', 'Escribe tu nombre completo.');
  if (!PHONE_RE.test(next.phone)) throw new AuthError('phone', 'Usa un teléfono dominicano, ej. 809-555-1234.');
  write(USERS, all.map((u) => (u.id === id ? next : u)));
  return publicUser(next);
}
