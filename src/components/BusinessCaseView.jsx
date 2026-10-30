import React, { useState } from 'react';
import {
  Briefcase,
  ShieldAlert,
  Layers,
  Cpu,
  QrCode,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Tv,
  Radio,
  Database,
  ArrowRight,
  Users,
  DollarSign,
  Lock,
  Wifi,
} from 'lucide-react';

export default function BusinessCaseView({ selectedTeam, onNavigateTab }) {
  const [activeSection, setActiveSection] = useState(1);

  const sections = [
    { id: 1, title: '1. Modelo de Negocios', icon: DollarSign, tag: 'SVOD + PPV + BOPIS + AdTech' },
    { id: 2, title: '2. Estructura Competitiva', icon: Tv, tag: 'Revenue Sharing & 2da Pantalla' },
    { id: 3, title: '3. Cadena de Valor', icon: Layers, tag: 'Centralización 360°' },
    { id: 4, title: '4. TIC & Data Mining', icon: Cpu, tag: 'Personalización Transversal' },
    { id: 5, title: '5. Proceso BOPIS QR', icon: QrCode, tag: 'Omnicanalidad sin Filas' },
    { id: 6, title: '6. Pasado, Presente y Futuro', icon: TrendingUp, tag: 'Súper App + AR' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/50 border border-slate-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/30 mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Arquitectura Estratégica del Proyecto
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ecosistema Digital Quisqueya Sport
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Explora de forma interactiva los 6 pilares estratégicos del proyecto y cómo cada requerimiento de negocio está implementado en este prototipo funcional.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('live')}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              Probar Streaming + AR <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('bopis')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              Probar BOPIS QR <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-6">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold leading-snug">{sec.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{sec.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      {activeSection === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className=" rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Ofertas de Productos / Servicios
            </div>
            <h3 className="text-lg font-bold text-white">Agregación, Distribución y Transacción</h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">1. Transmisión en Vivo y VOD:</strong>
                Juegos de LIDOM, LNB, Liga de Béisbol de Verano y Selección Dominicana de Voleibol en una cuenta única.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">2. Data y Analítica en Tiempo Real:</strong>
                Centro de estadísticas interactivo (Play-by-Play), velocidad de pitcheo y probabilidad de victoria.
              </li>
              <li className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">3. Comercio Integrado (BOPIS):</strong>
                Marketplace de mercancía oficial, boletas digitales y pedidos de alimentos en el estadio sin filas.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Estrategia de Monetización Mixta
            </div>
            <h3 className="text-lg font-bold text-white">4 Fuentes de Ingresos</h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <strong className="text-emerald-300 block">Suscripciones Recurrentes (SVOD):</strong>
                Plan Fanático Básico (RD$ 390/mes) y Plan Fanático VIP (RD$ 790/mes).
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block">Transacciones Únicas (PPV):</strong>
                Pago por evento para juegos exclusivos de Serie Final o torneos especiales (RD$ 195).
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block">Comercio Electrónico y BOPIS:</strong>
                Margen sobre venta de boletas, camisetas, gorras y comisión por pedidos de alimentos en estadio.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block">Publicidad Segmentada (AdTech):</strong>
                Banners dinámicos, pre-rolls e inserciones interactivas según el equipo del usuario.
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Estructura de Costos y Derechos
            </div>
            <h3 className="text-lg font-bold text-white">Costos Principales y Mitigación</h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <strong className="text-amber-300 block mb-0.5">
                  Derechos de Transmisión Digital (OTT):
                </strong>
                En vez de competir por señal abierta de TV, Quisqueya Sport negocia licencias exclusivas o co-exclusivas para OTT y dispositivos móviles.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">Infraestructura Cloud & CDN:</strong>
                Servidores escalables y Content Delivery Network de baja latencia para soportar picos en el 9no inning.
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-0.5">Desarrollo y Logística E-Commerce:</strong>
                Integración POS en estadios para ventanillas Fast-Track y despacho de mercancía oficial.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-red-400">
              Fuerzas Competitivas de la Industria
            </div>
            <h3 className="text-lg font-bold text-white">Mapa de Participantes y Poder Relativo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold text-[10px]">
                  PODER ALTO
                </span>
                <h4 className="font-bold text-white mt-2">Proveedores (Ligas y Equipos)</h4>
                <p className="text-slate-400 mt-1">
                  LIDOM, LNB, FEDOVOLI y franquicias poseen el monopolio del contenido original.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  RETO PRINCIPAL
                </span>
                <h4 className="font-bold text-white mt-2">Competidores Directos</h4>
                <p className="text-slate-400 mt-1">
                  MLB.tv, canales de YouTube individuales de equipos y TV abierta/cable (CDN, Coral, Digital 15).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                  PODER MODERADO
                </span>
                <h4 className="font-bold text-white mt-2">Compradores (Fanáticos)</h4>
                <p className="text-slate-400 mt-1">
                  Alta pasión por la pelota invernal y selección nacional, pero con acceso a sustitutos globales (ESPN, NBA).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                  AMENAZA / SUSTITUTO
                </span>
                <h4 className="font-bold text-white mt-2">Piratería Digital</h4>
                <p className="text-slate-400 mt-1">
                  IPTV ilegales y retransmisiones en Facebook/Twitch; se combate con UX superior, estadísticas y BOPIS.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Estrategia de Mitigación de Conflictos
            </div>
            <h3 className="text-lg font-bold text-white">
              Modelo &ldquo;Segunda Pantalla&rdquo; y Revenue Sharing
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <strong className="text-emerald-300 block mb-1">
                  1. Alianza Simulcast con Canales Tradicionales:
                </strong>
                En lugar de bloquear a CDN o Coral, Quisqueya Sport transmite en simulcast móvil/web y comparte un porcentaje de las suscripciones digitales y publicidad in-app, convirtiéndolos en socios financieros.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">
                  2. Geoblocking Inteligente por Territorio:
                </strong>
                Respeto automático de contratos regionales cuando una televisora local posee exclusividad territorial.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">
                  3. Socios Estratégicos Telco (Zero-Rating):
                </strong>
                Alianzas con Claro y Altice para que el streaming en Quisqueya Sport no consuma los datos móviles del plan del usuario.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 3 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Creación de Valor Centralizada
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Cadena de Valor: Del Contenido en Vivo a la Butaca del Fanático
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              El usuario ahorra tiempo y fricción al no tener que usar TV/radio por separado, otra web para estadísticas y hacer filas físicas en el estadio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'Negociación de Licencias',
                desc: 'Derechos OTT co-exclusivos y acuerdos de Revenue Sharing con ligas y canales.',
              },
              {
                step: '02',
                title: 'Ingesta Video & Datos',
                desc: 'Transmisión de baja latencia + captura de jugadas y métricas Statcast en vivo.',
              },
              {
                step: '03',
                title: 'Operaciones BOPIS',
                desc: 'Sincronización de inventario con tiendas y cafeterías del estadio vía QR.',
              },
              {
                step: '04',
                title: 'Marketing Segmentado',
                desc: 'Data Mining transversal según equipo favorito, ubicación e historial.',
              },
              {
                step: '05',
                title: 'Soporte al Fanático',
                desc: 'Asistencia en tiempo real en estadio (Fast-Track) y soporte de streaming.',
              },
            ].map((item) => (
              <div key={item.step} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-mono font-extrabold text-red-400">{item.step}</span>
                <h4 className="font-bold text-sm text-white mt-1">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <strong className="text-blue-400 block">Apoyo 1: Microservicios</strong>
              Escalabilidad elástica para juegos decisivos de Serie Final.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <strong className="text-emerald-400 block">Apoyo 2: Business Intelligence</strong>
              Analítica de hábitos de visualización y compras en estadio.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <strong className="text-amber-400 block">Apoyo 3: Blindaje Legal DRM</strong>
              Protección de derechos digitales y tokens anti-piratería.
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <strong className="text-purple-400 block">Apoyo 4: Talento Especializado</strong>
              Ingeniería de streaming, analistas deportivos y operaciones en estadios.
            </div>
          </div>
        </div>
      )}

      {activeSection === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Palanca Estratégica TIC: Minería de Datos Transversal
            </div>
            <h3 className="text-lg font-bold text-white">
              Simulador Activo: Perfil de Usuario ({selectedTeam.name})
            </h3>
            <p className="text-xs text-slate-300">
              Al cambiar tu equipo favorito en la barra superior, el motor de Data Mining de Quisqueya Sport cruza tus hábitos de visualización y compras para personalizar toda la interfaz:
            </p>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Equipo Detectado en Perfil Único:</span>
                <span className="font-bold text-white">{selectedTeam.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estadio Frecuente / Ruta:</span>
                <span className="font-semibold text-emerald-400">{selectedTeam.stadium}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">
                  Acción Automática del Algoritmo Hoy:
                </span>
                <p className="text-slate-200">{selectedTeam.promoMessage}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-blue-400 font-bold block mb-1">
                  Publicidad Hiper-Segmentada (AdTech):
                </span>
                <p className="text-slate-200">
                  {selectedTeam.adBanner.brand}: {selectedTeam.adBanner.offer}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Riesgos Críticos y Mitigación Tecnológica
            </div>
            <h3 className="text-lg font-bold text-white">
              Continuidad Operativa en el 9no Inning
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <strong className="text-rose-300 block mb-1">
                  Riesgo 1: Caída de servidores en el 9no inning de un Juego 7 de Serie Final
                </strong>
                <p className="text-slate-300">
                  Mitigación: Auto-scaling predictivo con balanceadores multi-región CDN y pre-calentamiento de clústeres 30 minutos antes del playball.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-white block mb-1">
                  Riesgo 2: Ataques DDoS y Piratería de Señal
                </strong>
                <p className="text-slate-400">
                  Mitigación: Encriptación DRM, marca de agua invisible por sesión y tokens dinámicos para el reproductor y códigos QR BOPIS.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <strong className="text-emerald-300 block mb-1">
                  Beneficio Estratégico:
                </strong>
                <p className="text-slate-300">
                  Monetización profunda por fanático (ARPU elevado) y experiencia de usuario sin parangón en el Caribe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 5 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Transformación Digital del Proceso de Ventas en Estadio
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                De las Filas Presenciales al Modelo Omnicanal BOPIS + In-Seat Delivery
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('bopis')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shrink-0"
            >
              Simular Compra BOPIS Ahora
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                PROCESO TRADICIONAL (ANTES)
              </span>
              <h4 className="font-bold text-white text-sm">Fricción y Pérdida de Ventas</h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>El fanático hace filas de 25-35 minutos en la cafetería o tienda del equipo.</li>
                <li>Se pierde jugadas clave (jonrones o cambios de pitcher) por estar en la fila.</li>
                <li>Manejo lento de efectivo/tarjetas sin visibilidad de stock real de camisetas.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                EVOLUCIÓN QUISQUEYA SPORT (AHORA)
              </span>
              <h4 className="font-bold text-white text-sm">BOPIS con QR Dinámico & Entrega en Butaca</h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>Ordena desde su asiento en 30 segundos mientras sigue viendo el juego en su móvil.</li>
                <li>El sistema descuenta inventario en tiempo real y genera un QR dinámico anti-fraude.</li>
                <li>Retira en Ventanilla Express (Fast-Track) en menos de 1 minuto o recibe en su asiento.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSection === 6 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px]">
              1. PASADO
            </span>
            <h3 className="text-base font-bold text-white">Consumo Físico y Lineal</h3>
            <p className="text-slate-400 leading-relaxed">
              Asistencia presencial con boletas de papel impresas, compra de mercancía y refrigerios únicamente en efectivo haciendo filas, y visualización atada al televisor tradicional según la programación fija de cada canal.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-amber-500/40 p-5 space-y-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px]">
              2. PRESENTE
            </span>
            <h3 className="text-base font-bold text-white">Fragmentación y Guerra de Derechos</h3>
            <p className="text-slate-300 leading-relaxed">
              Múltiples plataformas dispersas intentando transmitir, canales de televisión luchando por retener a la generación joven, páginas de estadísticas separadas y boleterías web que colapsan en juegos de alta demanda.
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-red-950/40 border border-red-500/50 p-5 space-y-3">
            <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-[11px]">
              3. FUTURO (QUISQUEYA SPORT)
            </span>
            <h3 className="text-base font-bold text-white">Consolidación en Súper App Deportiva</h3>
            <p className="text-slate-200 leading-relaxed">
              Integración de streaming 4K con Realidad Aumentada (AR) para superponer estadísticas en vivo, coexistencia lucrativa con canales de TV vía Revenue Sharing, pronósticos interactivos regulados y comercio BOPIS sin filas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
