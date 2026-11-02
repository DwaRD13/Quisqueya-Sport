import { delay, read, uid, write } from './storage.js';

const SUBS = 'qs-subscriptions-v1';
const PASSES = 'qs-passes-v1';

export const subscriptionOf = (userId) => {
  const sub = read(SUBS, {})[userId];
  return sub && sub.status === 'active' ? sub : null;
};

export async function subscribe(userId, plan, payment) {
  await delay(300);
  const start = new Date();
  const renews = new Date(start);
  renews.setMonth(renews.getMonth() + 1);
  const sub = { id: uid('SUB'), planId: plan.id, price: plan.price, status: 'active', startedAt: start.toISOString(), renewsAt: renews.toISOString(), payment };
  write(SUBS, { ...read(SUBS, {}), [userId]: sub });
  return sub;
}

export async function cancel(userId) {
  await delay(300);
  const all = read(SUBS, {});
  if (all[userId]) write(SUBS, { ...all, [userId]: { ...all[userId], status: 'cancelled' } });
}

export async function buyPass(userId, gameId, payment) {
  await delay(300);
  const pass = { id: uid('PPV'), userId, gameId, payment, expiresAt: new Date(Date.now() + 24 * 3600e3).toISOString() };
  write(PASSES, [pass, ...read(PASSES, [])]);
  return pass;
}

export const passesFor = (userId) => read(PASSES, []).filter((p) => p.userId === userId);
