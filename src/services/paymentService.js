import { delay } from './storage.js';

// Simulated card processor. No card data leaves the browser or is stored.
export const TEST_CARDS = [
  { number: '4242 4242 4242 4242', result: 'Aprobada' },
  { number: '4000 0000 0000 0002', result: 'Rechazada' },
  { number: '4000 0000 0000 9995', result: 'Fondos insuficientes' },
];

export const digits = (s) => (s ?? '').replace(/\D/g, '');

export function luhn(number) {
  const d = digits(number);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

export function cardBrand(number) {
  const d = digits(number);
  if (/^4/.test(d)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'American Express';
  return null;
}

export const formatCard = (s) => digits(s).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

export function validateCard({ name, number, expiry, cvc }, now = new Date()) {
  const errors = {};
  if (!name || name.trim().length < 3) errors.name = 'Escribe el nombre como aparece en la tarjeta.';
  if (!luhn(number)) errors.number = 'Número de tarjeta inválido.';
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(expiry ?? '');
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) errors.expiry = 'Usa el formato MM/AA.';
  else {
    const end = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    if (end <= now) errors.expiry = 'La tarjeta está vencida.';
  }
  const cvcLen = cardBrand(number) === 'American Express' ? 4 : 3;
  if (digits(cvc).length !== cvcLen) errors.cvc = `El CVV tiene ${cvcLen} dígitos.`;
  return errors;
}

export class PaymentError extends Error {}

export async function charge({ card, amount }) {
  await delay(1400);
  const d = digits(card.number);
  if (d === '4000000000000002') throw new PaymentError('Tu banco rechazó el pago. Prueba con otra tarjeta.');
  if (d === '4000000000009995') throw new PaymentError('Fondos insuficientes.');
  return { brand: cardBrand(d) ?? 'Tarjeta', last4: d.slice(-4), amount, authCode: Math.random().toString(36).slice(2, 8).toUpperCase() };
}
