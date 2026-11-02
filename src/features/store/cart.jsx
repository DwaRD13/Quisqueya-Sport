import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PRODUCTS from '../../data/products.json';
import { TICKETS } from '../../data/catalog.js';

export const CATALOG = [...PRODUCTS, ...TICKETS];
export const getProduct = (id) => CATALOG.find((p) => p.id === id);

const KEY = 'qs-cart-v1';
const CartContext = createContext(null);

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    // Drop lines whose product no longer exists in the catalog.
    return Array.isArray(saved) ? saved.filter((l) => getProduct(l.id)) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ }
  }, [lines]);

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
  }, [lines]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
