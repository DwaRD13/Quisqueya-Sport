import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Layers, QrCode, ShoppingBag, TrendingUp, Tv } from 'lucide-react';
import { PageHeader } from '../../shared/ui.jsx';

// Business pillars of the project, each pointing to where it already works on the site.
const PILLARS = [
  {
    id: 'modelo', icon: ShoppingBag, title: 'Modelo de negocio', tag: 'E-commerce + suscripciones + PPV',
    body: ['La tienda es el motor: mercancía oficial, comida del estadio y boletas en un solo carrito.', 'Las suscripciones (Fanático y VIP) generan ingreso recurrente; el VIP devuelve valor con 10% de descuento en la tienda.', 'El pase de un partido (PPV) captura al fanático ocasional.'],
    links: [['/tienda', 'Ir a la tienda'], ['/planes', 'Ver planes']],
  },
  {
    id: 'competencia', icon: Tv, title: 'Estructura competitiva', tag: 'Segunda pantalla',
    body: ['Los derechos de TV están fragmentados entre canales; la plataforma no compite por ellos, se vuelve la segunda pantalla.', 'Resultados, calendario, posiciones y resúmenes en video concentran la atención alrededor del juego.'],
    links: [['/partidos', 'Partidos'], ['/videos', 'Videos']],
  },
  {
    id: 'cadena', icon: Layers, title: 'Cadena de valor', tag: 'Del dato a la venta',
    body: ['Datos del partido → contenido → recomendación del equipo favorito → compra → retiro en el estadio.', 'Cada perfil guarda su equipo favorito y su historial de pedidos.'],
    links: [['/registro', 'Crear cuenta'], ['/equipos', 'Equipos']],
  },
  {
    id: 'datos', icon: BarChart3, title: 'Datos y personalización', tag: 'Fanático en el centro',
    body: ['Datos de juego de pelotainvernal.com: posiciones, resultados, lanzadores y calendario de toda la temporada.', 'El equipo favorito del usuario orienta lo que ve primero en su cuenta.'],
    links: [['/posiciones', 'Posiciones']],
  },
  {
    id: 'bopis', icon: QrCode, title: 'Compra y retiro sin filas', tag: 'Omnicanal',
    body: ['Hoy el fanático hace fila y se pierde jugadas. Aquí ordena desde el asiento y elige: retiro en la tienda del estadio, entrega en el asiento o envío a domicilio.', 'El inventario se descuenta al pagar y el pedido avanza de estado hasta estar listo.'],
    links: [['/tienda?cat=food', 'Comida del estadio'], ['/carrito', 'Carrito']],
  },
  {
    id: 'futuro', icon: TrendingUp, title: 'Pasado, presente y futuro', tag: 'Súper app deportiva',
    body: ['Pasado: información dispersa en emisoras, redes y taquillas.', 'Presente: este prototipo une datos, video, tienda y planes.', 'Futuro: backend real con pagos locales, boletería integrada y transmisiones propias.'],
    links: [],
  },
];

export default function EcosystemPage() {
  const [active, setActive] = useState(PILLARS[0].id);
  const pillar = PILLARS.find((p) => p.id === active);
  const Icon = pillar.icon;
  return (
    <div>
      <PageHeader eyebrow="Estrategia del proyecto" title="Ecosistema">
        <p className="max-w-2xl text-sm text-muted">Los 6 pilares de Quisqueya Sport y dónde funciona cada uno dentro del sitio.</p>
      </PageHeader>
      <div className="flex flex-wrap gap-6">
        <div role="tablist" aria-label="Pilares" className="flex flex-[1_1_260px] flex-col gap-2">
          {PILLARS.map((p, i) => (
            <button key={p.id} type="button" role="tab" aria-selected={active === p.id} onClick={() => setActive(p.id)} className={`card flex items-center gap-3 p-4 text-left ${active === p.id ? 'ring-2 ring-red' : 'hover:ring-1 hover:ring-edge'}`}>
              <span className="font-mono text-sm text-muted">{i + 1}</span>
              <span><b className="block">{p.title}</b><span className="text-xs text-muted">{p.tag}</span></span>
            </button>
          ))}
        </div>
        <section role="tabpanel" className="card flex min-w-0 flex-[999_1_480px] flex-col gap-4 p-6 sm:p-8">
          <Icon size={32} className="text-red" aria-hidden="true" />
          <h2 className="h-section">{pillar.title}</h2>
          {pillar.body.map((t) => <p key={t} className="leading-relaxed text-muted">{t}</p>)}
          {pillar.links.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">{pillar.links.map(([to, label]) => <Link key={to} to={to} className="btn-ghost">{label}</Link>)}</div>
          )}
        </section>
      </div>
    </div>
  );
}
