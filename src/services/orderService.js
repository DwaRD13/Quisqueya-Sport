import { delay, read, uid, write } from './storage.js';

const ORDERS = 'qs-orders-v1';
const STOCK = 'qs-stock-v1';

// Simulated inventory: each product starts with a fixed stock per category.
const START = { jersey: 12, cap: 20, apparel: 15, tickets: 200, food: 500 };
export function stockOf(product) {
  const map = read(STOCK, {});
  return map[product.id] ?? (product.inStock === false ? 0 : START[product.category] ?? 10);
}

export async function placeOrder({ userId, contact, lines, delivery, quote, payment }) {
  await delay(400);
  const map = read(STOCK, {});
  for (const l of lines) {
    const left = map[l.product.id] ?? stockOf(l.product);
    if (left < l.qty) throw new Error(`Solo quedan ${left} de “${l.product.name}”.`);
  }
  for (const l of lines) map[l.product.id] = (map[l.product.id] ?? stockOf(l.product)) - l.qty;
  write(STOCK, map);
  const order = {
    id: uid('QS'),
    userId: userId ?? null,
    contact,
    lines: lines.map((l) => ({ id: l.product.id, name: l.product.name, image: l.product.image, category: l.product.category, size: l.size, qty: l.qty, price: l.product.price })),
    delivery,
    quote,
    payment,
    createdAt: new Date().toISOString(),
  };
  write(ORDERS, [order, ...read(ORDERS, [])]);
  return order;
}

export const getOrder = (id) => read(ORDERS, []).find((o) => o.id === id) ?? null;
export const ordersFor = (userId) => read(ORDERS, []).filter((o) => o.userId === userId);

// Status advances with elapsed time so tracking feels alive without a backend.
const STEPS = {
  pickup: ['Recibido', 'Preparando', 'Listo para retirar'],
  seat: ['Recibido', 'Preparando', 'En camino a tu asiento'],
  home: ['Recibido', 'Preparando', 'Enviado'],
  digital: ['Recibido', 'Boletas emitidas'],
};
export function orderStatus(order, now = Date.now()) {
  const steps = STEPS[order.delivery.mode] ?? STEPS.pickup;
  const minutes = (now - new Date(order.createdAt).getTime()) / 60000;
  const index = Math.min(steps.length - 1, Math.floor(minutes / 2));
  return { steps, index, label: steps[index] };
}
