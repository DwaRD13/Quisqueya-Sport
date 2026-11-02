// Store prices are final retail prices with ITBIS (18%) included, as in DR retail.
export const ITBIS_RATE = 0.18;
export const VIP_DISCOUNT = 0.1;

export const PROVINCES = [
  { id: 'dn', label: 'Distrito Nacional', fee: 250 },
  { id: 'sd', label: 'Santo Domingo', fee: 250 },
  { id: 'santiago', label: 'Santiago', fee: 350 },
  { id: 'spm', label: 'San Pedro de Macorís', fee: 350 },
  { id: 'la-romana', label: 'La Romana', fee: 350 },
  { id: 'duarte', label: 'Duarte (San Francisco de Macorís)', fee: 400 },
  { id: 'other', label: 'Otra provincia', fee: 450 },
];
export const FREE_SHIPPING_FROM = 7500;
export const SEAT_FEE = 100;

// Lines: [{ product, qty }]. Only merch and food get the plan discount; tickets never do.
export function quote(lines, { delivery, province, vip }) {
  const subtotal = lines.reduce((n, l) => n + l.product.price * l.qty, 0);
  const discountable = lines.filter((l) => l.product.category !== 'tickets').reduce((n, l) => n + l.product.price * l.qty, 0);
  const discount = vip ? Math.round(discountable * VIP_DISCOUNT) : 0;
  let shipping = 0;
  if (delivery === 'home') {
    const fee = PROVINCES.find((p) => p.id === province)?.fee ?? 450;
    shipping = subtotal - discount >= FREE_SHIPPING_FROM ? 0 : fee;
  }
  if (delivery === 'seat') shipping = SEAT_FEE;
  const total = subtotal - discount + shipping;
  const itbis = Math.round(total - total / (1 + ITBIS_RATE));
  return { subtotal, discount, shipping, itbis, total };
}

// Which delivery modes the cart allows: food can't be shipped home, merch can't go to a seat.
export function deliveryModes(lines) {
  const cats = new Set(lines.map((l) => l.product.category));
  const physical = [...cats].some((c) => c !== 'tickets');
  if (!physical) return ['digital'];
  const modes = ['pickup'];
  if (!cats.has('food')) modes.push('home');
  if ([...cats].every((c) => c === 'food' || c === 'tickets')) modes.push('seat');
  return modes;
}
