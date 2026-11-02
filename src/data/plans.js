export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Plan Fanático Básico',
    price: 'RD$ 390',
    period: '/ mes',
    badge: 'Estándar HD',
    description:
      'Ideal para seguir a tu equipo favorito desde tu celular o laptop con estadísticas en vivo.',
    features: [
      'Transmisión en vivo 1080p en 1 pantalla (Móvil / Web)',
      'Juegos de Temporada Regular LIDOM, LNB y Liga de Verano',
      'Centro de Estadísticas Play-by-Play en tiempo real',
      'Acceso a compras BOPIS con fila express QR en estadios',
    ],
  },
  {
    id: 'vip',
    name: 'Plan Fanático VIP 4K + AR',
    price: 'RD$ 790',
    period: '/ mes',
    badge: 'Más Popular • Ecosistema Completo',
    highlighted: true,
    description:
      'La experiencia deportiva completa en 4K HDR con Realidad Aumentada, Multicámara y descuentos en el estadio.',
    features: [
      'Streaming 4K Ultra HD hasta en 4 pantallas simultáneas',
      'Round Robin, Serie Final LIDOM y Reinas del Caribe incluidos',
      'Modo Realidad Aumentada (AR Statcast) y Multicámara de dugout',
      '10% de descuento automático en alimentos BOPIS y Mercancía Oficial',
      'Entrega gratuita en tu asiento (In-Seat Delivery) en estadios aliados',
    ],
  },
  {
    id: 'ppv',
    name: 'Pase Diario / PPV (Pago Por Evento)',
    price: 'RD$ 195',
    period: '/ partido único',
    badge: 'Pago Único',
    description:
      'Perfecto para ver un Juego 7 decisivo, un clásico Águilas vs Licey o final de Voleibol.',
    features: [
      'Acceso inmediato por 24 horas al evento seleccionado',
      'Incluye repetición VOD completa y momentos destacados',
      'Estadísticas interactivas y compras BOPIS activadas',
      'Pago rápido con tarjeta local, transferencia o billetera digital',
    ],
  },
];
