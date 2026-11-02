// Prices are the prototype's original figures. Streaming itself is simulated;
// the store discount is applied for real at checkout.
export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Fanático',
    price: 390,
    period: 'mes',
    kind: 'subscription',
    badge: 'Estándar',
    description: 'Para seguir a tu equipo toda la temporada desde el celular o la computadora.',
    features: [
      'Transmisiones LIDOM, LNB y Liga de Verano en HD (simulado)',
      'Resultados, calendario y posiciones al día',
      'Reservas en la tienda con retiro en el estadio',
    ],
  },
  {
    id: 'vip',
    name: 'Fanático VIP',
    price: 790,
    period: 'mes',
    kind: 'subscription',
    badge: 'Más popular',
    highlighted: true,
    description: 'La experiencia completa: todos los partidos y descuento automático en la tienda.',
    features: [
      'Todo lo del plan Fanático',
      'Round Robin, Serie Final y Reinas del Caribe (simulado)',
      '10% de descuento automático en mercancía y comida',
      'Entrega en tu asiento en estadios aliados',
    ],
  },
  {
    id: 'ppv',
    name: 'Pase de un partido',
    price: 195,
    period: 'partido',
    kind: 'pass',
    badge: 'Pago único',
    description: 'Acceso por 24 horas a un partido que elijas del calendario.',
    features: [
      'Válido 24 horas desde la compra',
      'Eliges el partido del calendario',
      'Sin renovación automática',
    ],
  },
];

export const getPlan = (id) => SUBSCRIPTION_PLANS.find((p) => p.id === id);
