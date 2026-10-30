import React, { useState, useEffect } from 'react';
import {
  QrCode,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Utensils,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Armchair,
  Zap,
} from 'lucide-react';

export default function BopisModal({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
  selectedTeam,
  userPlan,
}) {
  const [deliveryMode, setDeliveryMode] = useState('bopis'); // 'bopis' | 'in-seat' | 'home'
  const [stadiumName, setStadiumName] = useState('Estadio Quisqueya Juan Marichal');
  const [seatInfo, setSeatInfo] = useState('Palco A • Fila 4 • Asiento 12');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderStep, setOrderStep] = useState(1); // 1: Recibido, 2: Preparando, 3: Listo en Ventanilla Express
  const [qrTimer, setQrTimer] = useState(30);
  const [qrSeed, setQrSeed] = useState('QS-8492-RD');

  useEffect(() => {
    if (!orderCompleted) return;
    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          setQrSeed(`QS-${Math.floor(1000 + Math.random() * 9000)}-RD`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderCompleted]);

  useEffect(() => {
    if (!orderCompleted) return;
    const t1 = setTimeout(() => setOrderStep(2), 1800);
    const t2 = setTimeout(() => setOrderStep(3), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [orderCompleted]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const vipDiscount = userPlan === 'vip' ? Math.round(subtotal * 0.1) : 0;
  const inSeatFee = deliveryMode === 'in-seat' && userPlan !== 'vip' ? 120 : 0;
  const total = subtotal - vipDiscount + inSeatFee;

  const handleCheckout = () => {
    setOrderCompleted(true);
    setOrderStep(1);
  };

  const handleResetAndClose = () => {
    setOrderCompleted(false);
    setOrderStep(1);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                Checkout Omnicanal BOPIS & Estadio
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Sin Filas
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Buy Online, Pick Up In Stadium • Inventario en Tiempo Real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!orderCompleted ? (
          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Delivery mode selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Selecciona Modalidad de Retiro / Entrega
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => setDeliveryMode('bopis')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    deliveryMode === 'bopis'
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      GRATIS
                    </span>
                  </div>
                  <div className="font-semibold text-sm">Fila Express BOPIS</div>
                  <div className="text-[11px] text-slate-400">
                    Retira en ventanilla Fast-Track con QR dinámico
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMode('in-seat')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    deliveryMode === 'in-seat'
                      ? 'bg-blue-500/15 border-blue-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Armchair className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {userPlan === 'vip' ? 'GRATIS VIP' : '+RD$ 120'}
                    </span>
                  </div>
                  <div className="font-semibold text-sm">In-Seat Delivery</div>
                  <div className="text-[11px] text-slate-400">
                    Te lo llevamos directo a tu butaca sin levantarte
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMode('home')}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    deliveryMode === 'home'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      24-48H
                    </span>
                  </div>
                  <div className="font-semibold text-sm">Envío a Domicilio</div>
                  <div className="text-[11px] text-slate-400">
                    Para jerseys, gorras y mercancía oficial en todo el país
                  </div>
                </button>
              </div>
            </div>

            {/* Stadium & Seat Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Estadio Actual (Geolocalizado)
                </label>
                <select
                  value={stadiumName}
                  onChange={(e) => setStadiumName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option>Estadio Quisqueya Juan Marichal (SD)</option>
                  <option>Estadio Cibao (Santiago)</option>
                  <option>Estadio Tetelo Vargas (San Pedro)</option>
                  <option>Estadio Julián Javier (SFM)</option>
                  <option>Estadio Francisco Micheli (La Romana)</option>
                  <option>Palacio del Voleibol Ricardo Arias</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5 text-blue-400" /> Ubicación de Butaca / Puerta
                </label>
                <input
                  type="text"
                  value={seatInfo}
                  onChange={(e) => setSeatInfo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Cart Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  2. Resumen de tu Pedido ({cart.length} {cart.length === 1 ? 'artículo' : 'artículos'})
                </span>
                {selectedTeam && (
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Perfil {selectedTeam.shortName} Activo
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                  <Utensils className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Tu carrito BOPIS está vacío.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Agrega refrigerios del estadio, boletas o camisetas oficiales para generar tu código QR.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800/80"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="font-medium text-sm text-white truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-emerald-400 font-medium">{item.pickupGate}</span>
                          <span>•</span>
                          <span>Cant: {item.qty}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-sm text-white">
                          RD$ {(item.price * item.qty).toLocaleString()}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals & Action */}
            {cart.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal de productos</span>
                  <span>RD$ {subtotal.toLocaleString()}</span>
                </div>
                {vipDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400">
                    <span>Descuento Plan Fanático VIP (-10%)</span>
                    <span>- RD$ {vipDiscount.toLocaleString()}</span>
                  </div>
                )}
                {deliveryMode === 'in-seat' && (
                  <div className="flex justify-between text-xs text-blue-400">
                    <span>Servicio In-Seat Delivery ({seatInfo})</span>
                    <span>{inSeatFee === 0 ? 'GRATIS (VIP)' : `RD$ ${inSeatFee}`}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="font-bold text-sm text-white">Total a Pagar</span>
                  <span className="font-extrabold text-lg text-emerald-400">
                    RD$ {total.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
                >
                  <QrCode className="w-4 h-4" />
                  Confirmar Pago y Generar QR Dinámico Sin Filas
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Order Completed: Dynamic QR Pass */
          <div className="p-6 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Orden #{qrSeed} Confirmada en Tiempo Real
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white">
                {deliveryMode === 'in-seat'
                  ? '¡Tu pedido va camino a tu butaca!'
                  : 'Pase Fast-Track BOPIS Activado'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {stadiumName} • {seatInfo}
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto text-left">
              <div
                className={`p-2.5 rounded-xl border ${
                  orderStep >= 1
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Paso 1</div>
                <div className="text-xs font-semibold mt-0.5">Inventario Validado</div>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  orderStep >= 2
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Paso 2</div>
                <div className="text-xs font-semibold mt-0.5">Preparando Orden</div>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  orderStep >= 3
                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] uppercase font-bold">Paso 3</div>
                <div className="text-xs font-semibold mt-0.5">
                  {deliveryMode === 'in-seat' ? 'Repartidor en Fila' : '¡Listo Ventanilla #3!'}
                </div>
              </div>
            </div>

            {/* Simulated Dynamic QR Code */}
            <div className="relative mx-auto w-56 h-56 rounded-2xl bg-white p-4 shadow-xl flex flex-col items-center justify-center border-4 border-emerald-500">
              <div className="grid grid-cols-7 gap-1 w-40 h-40">
                {Array.from({ length: 49 }).map((_, idx) => {
                  const active = (idx * 7 + qrTimer) % 3 !== 0 || idx < 7 || idx > 41;
                  return (
                    <div
                      key={idx}
                      className={`rounded-sm transition-colors duration-300 ${
                        active ? 'bg-slate-950' : 'bg-slate-200'
                      }`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 text-[11px] font-mono font-bold text-slate-900 tracking-widest">
                {qrSeed}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                QR dinámico se actualiza en {qrTimer}s
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Anti-Fraude Activo
              </span>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
              >
                Volver a la Transmisión en Vivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
