import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Img, money } from '../../shared/ui.jsx';
import { useCart } from './cart.jsx';
import { stockOf } from '../../services/orderService.js';

export default function ProductCard({ product }) {
  const cart = useCart();
  const [added, setAdded] = useState(false);
  const needsSize = product.sizes.length > 0;

  const add = () => {
    cart.add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="card flex flex-col overflow-hidden">
      <Link to={`/tienda/${product.id}`} className="block bg-white">
        <Img src={product.image} alt={product.name} fit="contain" className="aspect-square w-full p-2" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link to={`/tienda/${product.id}`} className="line-clamp-2 font-semibold hover:text-flag-soft">{product.name}</Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-mono font-bold">{money(product.price)}</span>
          {!product.inStock || stockOf(product) <= 0 ? (
            <span className="text-xs font-semibold text-muted">Agotado</span>
          ) : needsSize ? (
            <Link to={`/tienda/${product.id}`} className="inline-flex h-11 items-center rounded-full border border-edge px-4 text-sm font-semibold hover:border-muted">Elegir opción</Link>
          ) : (
            <button type="button" onClick={add} className="inline-flex h-11 items-center gap-1 rounded-full bg-red px-4 text-sm font-semibold text-white">
              {added ? <><Check size={16} aria-hidden="true" /> Agregado</> : 'Agregar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
