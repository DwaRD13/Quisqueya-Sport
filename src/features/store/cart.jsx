import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PRODUCTS from '../../data/products.json';
import { TICKETS } from '../../data/catalog.js';
import FOOD from '../../data/food.js';
import { useAuth } from '../account/auth.jsx';

export const CATALOG = [...PRODUCTS, ...FOOD, ...TICKETS];
export const getProduct = (id) => CATALOG.find((p) => p.id === id);

const keyFor = (userId) => `qs-cart-v1:${userId ?? 'guest'}`;
const CartContext = createContext(null);

function load(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]');
    // Drop lines whose product no longer exists in the catalog.
    return Array.isArray(saved) ? saved.filter((l) => getProduct(l.id)) : [];
  } catch {
    return [];
  }
}

const mergeLines = (a, b) => b.reduce((acc, l) => {
  const hit = acc.find((x) => x.id === l.id && x.size === l.size);
  return hit ? acc.map((x) => (x === hit ? { ...x, qty: x.qty + l.qty } : x)) : [...acc, l];
}, a);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const key = keyFor(user?.id);
  const [state, setState] = useState(() => ({ key, lines: load(key) }));

  // On login, the guest cart merges into the user's cart; on logout the guest cart starts empty.
  if (state.key !== key) {
    const fromGuest = user ? load(keyFor(null)) : [];
    if (user) { try { localStorage.removeItem(keyFor(null)); } catch { /* storage unavailable */ } }
    setState({ key, lines: mergeLines(load(key), fromGuest) });
  }
  const lines = state.key === key ? state.lines : [];
  const setLines = (next) => setState((s) => ({ ...s, lines: typeof next === 'function' ? next(s.lines) : next }));

  useEffect(() => {
    try { localStorage.setItem(state.key, JSON.stringify(state.lines)); } catch { /* storage unavailable */ }
  }, [state]);

  const api = useMemo(() => {
    const keyOf = (id, size) => `${id}::${size ?? ''}`;
    const items = lines.map((l) => ({ ...l, product: getProduct(l.id) }));
    return {
      items,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: items.reduce((n, l) => n + l.qty * l.product.price, 0),
      add(id, size = null, qty = 1) {
        setLines((prev) => {
          const hit = prev.find((l) => keyOf(l.id, l.size) === keyOf(id, size));
          if (hit) return prev.map((l) => (l === hit ? { ...l, qty: l.qty + qty } : l));
          return [...prev, { id, size, qty }];
        });
      },
      setQty(id, size, qty) {
        setLines((prev) => prev
          .map((l) => (keyOf(l.id, l.size) === keyOf(id, size) ? { ...l, qty } : l))
          .filter((l) => l.qty > 0));
      },
      remove(id, size) {
        setLines((prev) => prev.filter((l) => keyOf(l.id, l.size) !== keyOf(id, size)));
      },
      clear() { setLines([]); },
    };
  }, [lines]); // eslint-disable-line react-hooks/exhaustive-deps

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
