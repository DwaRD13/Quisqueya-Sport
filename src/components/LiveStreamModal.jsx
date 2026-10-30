import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Activity,
  Zap,
  QrCode,
  Radio,
  Plus,
  Check,
  Eye,
} from 'lucide-react';
import { BOPIS_ITEMS } from '../data/mockData';
import ProductVisual from './ProductVisual';

export default function LiveStreamModal({
  isOpen,
  onClose,
  game,
  selectedTeam,
  onAddToCart,
  onOpenBopis,
  totalCartItems,
}) {
  const [arEnabled, setArEnabled] = useState(true);
  const [cameraAngle, setCameraAngle] = useState('Principal 4K HDR');
  const [simPlays, setSimPlays] = useState([]);
  const [extraRuns, setExtraRuns] = useState(0);
  const [addedItemId, setAddedItemId] = useState(null);

  if (!isOpen || !game) return null;

  const handleSimulatePitch = () => {
    const events = [
      {
        inning: 'En Vivo',
        time: 'Ahora mismo',
        text: `¡Línea contundente a 107.8 MPH al jardín central! Anota corredor desde tercera para ${selectedTeam.shortName}.`,
        highlight: true,
        addRun: 1,
      },
      {
        inning: 'En Vivo',
        time: 'Ahora mismo',
        text: 'Slider rompiente a 89.2 MPH en la esquina baja. ¡Strike 3 cantado!',
        highlight: false,
        addRun: 0,
      },
      {
        inning: 'En Vivo',
        time: 'Ahora mismo',
        text: 'Corredor se roba la segunda base (Velocidad sprint: 29.4 ft/s).',
        highlight: true,
        addRun: 0,
      },
    ];
    const next = events[simPlays.length % events.length];
    setSimPlays((prev) => [{ id: Date.now(), ...next }, ...prev]);
    if (next.addRun) setExtraRuns((r) => r + next.addRun);
  };

  const handleQuickAdd = (item) => {
    onAddToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-7xl rounded-2xl bg-[#131b26] border border-slate-700/80 overflow-hidden shadow-2xl my-auto">
        {/* Top Broadcast Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {game.status}
            </span>
            <span className="text-sm font-bold text-white hidden sm:inline">
              {game.title}
            </span>
            <span className="text-xs text-slate-400 hidden md:inline">
              • {game.simulcastPartner}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenBopis}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <QrCode className="w-3.5 h-3.5" />
              Pase QR Estadio ({totalCartItems})
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Broadcast Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 8 Cols: Stadium Live Stream + AR Overlay */}
          <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[480px] flex flex-col justify-between p-5 sm:p-7 overflow-hidden">
            <img
              src={game.backdropImage}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/70" />

            {/* Top Player Controls */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-500" />
                  {game.viewers} conectados
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-emerald-400">
                  {game.quality}
                </span>
              </div>

              <button
                onClick={() => setArEnabled(!arEnabled)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border backdrop-blur-md transition flex items-center gap-1.5 ${
                  arEnabled
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                    : 'bg-slate-950/70 border-slate-700 text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Realidad Aumentada (AR Statcast): {arEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Center Scorebug & AR Telemetry */}
            <div className="relative z-10 my-auto py-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-700 rounded-xl p-4 min-w-[270px] shadow-2xl">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <span>{game.leagueLabel}</span>
                  <span>{cameraAngle}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">
                      {game.title.split(' vs ')[0]}
                    </span>
                    <span className="font-mono font-extrabold text-2xl text-amber-400">
                      {game.awayScore + extraRuns}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-white">
                      {game.title.split(' vs ')[1]}
                    </span>
                    <span className="font-mono font-extrabold text-2xl text-white">
                      {game.homeScore}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Conteo: {game.count.balls}B - {game.count.strikes}S • {game.count.outs} Out
                  </span>
                  <span className="text-emerald-400 font-bold">{game.pitchSpeed}</span>
                </div>
              </div>

              {arEnabled && (
                <div className="grid grid-cols-2 gap-2.5">
                  {game.arMetrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-emerald-500/40 shadow-xl"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3" /> {m.label}
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-slate-400">{m.delta}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Camera Switcher & Live Pitch Simulator */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  'Principal 4K HDR',
                  'Cámara Dugout VIP',
                  'Ángulo Detrás del Plato',
                  'Vista Drone Estadio',
                ].map((cam) => (
                  <button
                    key={cam}
                    onClick={() => setCameraAngle(cam)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      cameraAngle === cam
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {cam}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSimulatePitch}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition"
              >
                <Zap className="w-3.5 h-3.5" />
                Simular Jugada en Vivo
              </button>
            </div>
          </div>

          {/* Right 4 Cols: Segunda Pantalla (In-Stream BOPIS + Play-by-Play) */}
          <div className="lg:col-span-4 bg-[#16202e] border-l border-slate-800 p-5 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4" /> BOPIS Sin Filas en el Estadio
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold">
                  Fast-Track
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pide desde tu asiento mientras ves el partido y retira con código QR dinámico:
              </p>

              <div className="space-y-2">
                {BOPIS_ITEMS.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <ProductVisual item={item} className="h-12" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{item.name}</div>
                      <div className="text-[11px] text-emerald-400">
                        RD$ {item.price.toLocaleString()} • {item.prepTime}
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                        addedItemId === item.id
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {addedItemId === item.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-red-500" />
                Play-by-Play en Tiempo Real
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {[...simPlays, ...game.playByPlay].map((play) => (
                  <div
                    key={play.id}
                    className={`p-2.5 rounded-xl border text-xs ${
                      play.highlight
                        ? 'bg-blue-500/15 border-blue-500/40 text-white'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-amber-400">{play.inning}</span>
                      <span>{play.time}</span>
                    </div>
                    <p>{play.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
