import React, { useState, useMemo } from 'react';
import {
  Play,
  QrCode,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Wifi,
  ShieldCheck,
  Eye,
  Plus,
  Check,
  MapPin,
  Trophy,
  Activity,
} from 'lucide-react';
import {
  LEAGUES,
  STADIUMS,
  TEAMS,
  LIVE_GAMES,
  BOPIS_ITEMS,
  SUBSCRIPTION_PLANS,
  STANDINGS_LIDOM,
} from './data/mockData';
import BopisModal from './components/BopisModal';
import BusinessCaseView from './components/BusinessCaseView';
import TeamProfileModal from './components/TeamProfileModal';
import LiveStreamModal from './components/LiveStreamModal';
import ProductVisual from './components/ProductVisual';

export default function App() {
  // Navigation & League/Sport State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'stadiums' | 'bopis' | 'stats' | 'plans' | 'case'
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedTeamId, setSelectedTeamId] = useState('aguilas');
  const [activeGameId, setActiveGameId] = useState('game-lidom-1');
  const [leagueDropdownOpen, setLeagueDropdownOpen] = useState(false);

  // Modals
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isStreamModalOpen, setIsStreamModalOpen] = useState(false);
  const [isBopisModalOpen, setIsBopisModalOpen] = useState(false);

  // Telco Zero-Rating & Plan
  const [zeroDataTelco, setZeroDataTelco] = useState(true);
  const [userPlan, setUserPlan] = useState('vip');
  const [bopisCategory, setBopisCategory] = useState('all');
  const [justAddedId, setJustAddedId] = useState(null);

  // Cart State
  const [cart, setCart] = useState([
    {
      id: 'merch-1',
      name: 'Jersey Oficial Águilas Cibaeñas 2026 (Amarilla #22)',
      price: 3450,
      pickupGate: 'Tienda Oficial Estadio Locker #4',
      qty: 1,
    },
    {
      id: 'food-1',
      name: 'Combo Estadio Quisqueya (2 Empanadas + Refresco Frío)',
      price: 380,
      pickupGate: 'Ventanilla Fast-Track #3 (Palco A)',
      qty: 1,
    },
  ]);

  const selectedTeam = useMemo(
    () => TEAMS.find((t) => t.id === selectedTeamId) || TEAMS[0],
    [selectedTeamId]
  );

  const currentLeagueObj = useMemo(
    () => LEAGUES.find((l) => l.id === selectedLeague) || LEAGUES[0],
    [selectedLeague]
  );

  const filteredGames = useMemo(() => {
    if (selectedLeague === 'all') return LIVE_GAMES;
    return LIVE_GAMES.filter((g) => g.league === selectedLeague);
  }, [selectedLeague]);

  const filteredTeams = useMemo(() => {
    if (selectedLeague === 'all') return TEAMS;
    return TEAMS.filter((t) => t.league === selectedLeague);
  }, [selectedLeague]);

  const filteredStadiums = useMemo(() => {
    if (selectedLeague === 'all') return STADIUMS;
    return STADIUMS.filter((s) => s.league === selectedLeague);
  }, [selectedLeague]);

  const heroGame = useMemo(() => {
    const matchInLeague = filteredGames.find((g) => g.id === activeGameId);
    return matchInLeague || filteredGames[0] || LIVE_GAMES[0];
  }, [filteredGames, activeGameId]);

  const filteredBopisItems = useMemo(() => {
    if (bopisCategory === 'all') return BOPIS_ITEMS;
    return BOPIS_ITEMS.filter((i) => i.category === bopisCategory);
  }, [bopisCategory]);

  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          pickupGate: item.pickupGate,
          qty: 1,
        },
      ];
    });
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1300);
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const handlePlayGame = (gameId) => {
    setActiveGameId(gameId);
    setIsStreamModalOpen(true);
  };

  const menuLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'stadiums', label: 'Estadios & Equipos' },
    { id: 'bopis', label: 'Tienda & BOPIS QR' },
    { id: 'stats', label: 'Estadísticas' },
    { id: 'plans', label: 'Planes & PPV' },
    { id: 'case', label: 'Ecosistema (6 Puntos)' },
  ];

  return (
    <div className="min-h-screen bg-[#0f141c] text-slate-100 font-sans pb-24 lg:pb-16">
      {/* ==================== TOP SPORTS HEADER & LEAGUE SWITCHER ==================== */}
      <header className="sticky top-0 z-40 bg-[#0f141c]/95 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Left: Clean Sports Brand + Main Menu + League Dropdown */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div
              onClick={() => {
                setActiveTab('home');
                setSelectedLeague('all');
              }}
              className="cursor-pointer flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center font-condensed font-bold text-lg text-white shadow-md">
                QS
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Quisqueya
                </span>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-blue-400">
                  Sport
                </span>
              </div>
            </div>

            {/* Clean Navigation Links */}
            <nav className="hidden xl:flex items-center gap-5">
              {menuLinks.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => setActiveTab(link.id)}
                    className={`text-sm transition ${
                      isActive
                        ? 'font-bold text-white border-b-2 border-blue-500 py-1'
                        : 'font-medium text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Sport / League Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLeagueDropdownOpen(!leagueDropdownOpen)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-white flex items-center gap-2 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Liga: {currentLeagueObj.shortLabel}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {leagueDropdownOpen && (
                <div
                  onMouseLeave={() => setLeagueDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-xl bg-[#151e2b] border border-slate-700 shadow-2xl p-2 z-50"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Seleccionar Deporte o Liga
                  </div>
                  {LEAGUES.map((lg) => (
                    <button
                      key={lg.id}
                      onClick={() => {
                        setSelectedLeague(lg.id);
                        setLeagueDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-lg text-left flex items-center justify-between transition ${
                        selectedLeague === lg.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{lg.name}</div>
                        <div className="text-[11px] opacity-80">{lg.badge}</div>
                      </div>
                      {selectedLeague === lg.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Zero-Data Telco Badge + QR BOPIS Button + Team Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setZeroDataTelco(!zeroDataTelco)}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                zeroDataTelco
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
              title="Alianza con Telecomunicaciones para no consumir datos móviles"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>{zeroDataTelco ? 'Cero Data: Activo' : 'Cero Data: Off'}</span>
            </button>

            {/* Stadium QR Pass Button */}
            <button
              onClick={() => setIsBopisModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 transition"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Pase QR BOPIS</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold">
                {totalCartItems}
              </span>
            </button>

            {/* Team Profile Avatar Switcher */}
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition group"
              title="Cambiar tu equipo favorito"
            >
              <div className="w-7 h-7 rounded-lg bg-white p-0.5 flex items-center justify-center shadow overflow-hidden">
                <img
                  src={selectedTeam.logoUrl}
                  alt={selectedTeam.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 leading-none">Mi Equipo</div>
                <div className="text-xs font-bold text-white leading-tight">
                  {selectedTeam.shortName}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </button>
          </div>
        </div>

        {/* Sub-Bar: Clean Sport & League Selector Pills */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-2.5 border-t border-slate-800/70 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {LEAGUES.map((lg) => {
              const active = selectedLeague === lg.id;
              return (
                <button
                  key={lg.id}
                  onClick={() => setSelectedLeague(lg.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                    active
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {lg.name}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Experiencia personalizada para <strong className="text-white">{selectedTeam.name}</strong>
            </span>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="text-blue-400 hover:underline font-semibold ml-1"
            >
              Cambiar equipo
            </button>
          </div>
        </div>
      </header>

      {/* ==================== VIEW 1: INICIO (NATURAL SPORTS BROADCAST HUB) ==================== */}
      {activeTab === 'home' && (
        <div className="space-y-10">
          {/* HERO MATCH BANNER */}
          <section className="relative w-full min-h-[480px] lg:min-h-[540px] flex items-end overflow-hidden border-b border-slate-800">
            <img
              src={heroGame.backdropImage}
              alt={heroGame.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f141c] via-[#0f141c]/85 to-[#0f141c]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f141c] via-[#0f141c]/30 to-transparent" />

            <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pb-10 pt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8 space-y-4">
                {/* Live Broadcast Badges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-xs font-bold uppercase shadow">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    {heroGame.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/20 border border-blue-400/30 text-xs font-bold text-blue-300">
                    {heroGame.leagueLabel}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700 text-xs text-slate-300">
                    {heroGame.quality}
                  </span>
                </div>

                {/* Clean Athletic Title in Roboto */}
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  {heroGame.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {heroGame.subtitle} •{' '}
                  <span className="text-emerald-400 font-semibold">{heroGame.venue}</span>
                </p>

                {/* Live Scoreboard Box */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 flex items-center gap-5">
                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                        Marcador Actual
                      </div>
                      <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white">
                        {heroGame.awayScore} <span className="text-slate-500">-</span>{' '}
                        {heroGame.homeScore}
                      </div>
                    </div>
                    <div className="h-8 w-px bg-slate-700" />
                    <div>
                      <div className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">
                        Último Pitcheo / Acción
                      </div>
                      <div className="text-sm font-bold text-white">{heroGame.pitchSpeed}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-0.5">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      {heroGame.simulcastPartner}
                    </div>
                    <div className="text-slate-400">{heroGame.geoblockStatus}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handlePlayGame(heroGame.id)}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-blue-600/25 transition"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Ver Transmisión En Vivo (4K + AR)
                  </button>

                  <button
                    onClick={() => setIsBopisModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 transition"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Pedir al Estadio sin Filas (BOPIS)
                  </button>

                  <button
                    onClick={() => setIsTeamModalOpen(true)}
                    className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-medium text-sm flex items-center gap-2 transition"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Cambiar Equipo
                  </button>
                </div>
              </div>

              {/* Right Column: Personalized Team & AdTech Card */}
              <div className="lg:col-span-4">
                <div className="rounded-2xl bg-[#151e2b]/95 backdrop-blur-xl border border-slate-700/80 p-5 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shrink-0">
                        <img
                          src={selectedTeam.logoUrl}
                          alt={selectedTeam.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                          Tu Perfil • Data Mining
                        </div>
                        <div className="text-sm font-bold text-white">{selectedTeam.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsTeamModalOpen(true)}
                      className="text-xs text-blue-400 hover:underline font-medium"
                    >
                      Cambiar
                    </button>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedTeam.promoMessage}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-blue-400 uppercase">
                        {selectedTeam.adBanner.brand}
                      </div>
                      <div className="text-xs text-slate-300 truncate">
                        {selectedTeam.adBanner.offer}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('bopis')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition"
                    >
                      {selectedTeam.adBanner.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MAIN CONTENT SECTIONS */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
            {/* ==================== ROW 1: PARTIDOS EN VIVO AHORA ==================== */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    Partidos En Vivo Ahora ({currentLeagueObj.name})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Selecciona cualquier partido para abrir la transmisión con estadísticas Statcast y multicámara
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    onClick={() => handlePlayGame(game.id)}
                    className="sport-card-hover group relative rounded-xl overflow-hidden bg-[#151e2b] border border-slate-800 hover:border-slate-600 cursor-pointer shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={game.thumbImage}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151e2b] via-black/25 to-black/40" />

                      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase">
                          EN VIVO
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-200 font-medium flex items-center gap-1">
                          <Eye className="w-3 h-3 text-red-400" /> {game.viewers}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 inset-x-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400">
                          {game.leagueLabel}
                        </span>
                        <span className="font-mono font-extrabold text-lg text-white bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                          {game.awayScore} - {game.homeScore}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h3 className="font-bold text-sm text-white truncate">{game.title}</h3>
                      <div className="text-xs text-emerald-400 font-medium truncate">
                        {game.status}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{game.venue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ==================== ROW 2: COMPRAS REALISTAS EN EL ESTADIO (JERSEYS OFICIALES, GORRAS Y COMIDA BOPIS) ==================== */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Tienda Oficial & Pedidos BOPIS sin Filas en el Estadio
                  </h2>
                  <p className="text-xs text-slate-400">
                    Jerseys oficiales de las Águilas, Licey y Reinas del Caribe, gorras 59FIFTY y gastronomía del estadio con retiro QR
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bopis')}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  Ver toda la tienda ({BOPIS_ITEMS.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {BOPIS_ITEMS.slice(0, 8).map((item) => (
                  <div
                    key={item.id}
                    className="sport-card-hover group rounded-xl overflow-hidden bg-[#151e2b] border border-slate-800 hover:border-slate-600 flex flex-col justify-between shadow-md"
                  >
                    <div>
                      <div className="relative">
                        <ProductVisual item={item} className="h-44" />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-0.5">
                          {item.categoryLabel}
                        </div>
                        <h3 className="font-bold text-sm text-white line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{item.pickupGate}</span>
                        <span className="text-base font-extrabold text-white">
                          RD$ {item.price.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                          justAddedId === item.id
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {justAddedId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Agregado
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" /> Pedir QR
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ==================== ROW 3: EXPLORA POR DEPORTE Y LIGA ==================== */}
            <section className="space-y-3.5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Deportes y Ligas en Quisqueya Sport
                </h2>
                <p className="text-xs text-slate-400">
                  Haz clic en cualquier liga para filtrar partidos, equipos y estadios
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {LEAGUES.map((lg) => {
                  const isSelected = selectedLeague === lg.id;
                  return (
                    <div
                      key={lg.id}
                      onClick={() => setSelectedLeague(lg.id)}
                      className={`sport-card-hover relative h-36 rounded-xl overflow-hidden cursor-pointer border ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/50'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={lg.coverImage}
                        alt={lg.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                      <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                        <span className="self-start px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold uppercase text-blue-300 border border-slate-700">
                          {lg.badge}
                        </span>
                        <div>
                          <h3 className="font-bold text-base text-white leading-tight">
                            {lg.name}
                          </h3>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                            {lg.tagline}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ==================== ROW 4: EQUIPOS Y SELECCIONES ==================== */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Equipos y Selecciones ({currentLeagueObj.shortLabel})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Selecciona tu equipo favorito para activar promociones y estadísticas personalizadas
                  </p>
                </div>
                <button
                  onClick={() => setIsTeamModalOpen(true)}
                  className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
                >
                  Cambiar equipo <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-2">
                {filteredTeams.map((team) => {
                  const isMyTeam = team.id === selectedTeamId;
                  return (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`sport-card-hover shrink-0 w-72 rounded-xl overflow-hidden bg-[#151e2b] border cursor-pointer ${
                        isMyTeam ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-800'
                      }`}
                    >
                      <div className="relative h-36 w-full overflow-hidden">
                        <img
                          src={team.image}
                          alt={team.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151e2b] via-slate-950/40 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-white">
                          {team.leagueName} • {team.city}
                        </div>
                        {isMyTeam && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-blue-600 text-[10px] font-bold text-white">
                            ACTIVO
                          </div>
                        )}
                        <div className="absolute bottom-2.5 left-3 flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg border border-slate-200 shrink-0">
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">{team.name}</h3>
                            <p className="text-[11px] text-amber-400 font-semibold">{team.titles}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3.5 flex items-center justify-between text-xs text-slate-300">
                        <span className="truncate">{team.stadium}</span>
                        <span className="font-mono font-bold text-white shrink-0 ml-2">
                          {team.record}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ==================== ROW 5: ESTADIOS Y ARENAS ==================== */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Estadios Conectados con Filas Express BOPIS
                  </h2>
                  <p className="text-xs text-slate-400">
                    Conoce los estadios habilitados con ventanillas Fast-Track QR y entrega en asiento
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStadiums.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setIsBopisModalOpen(true)}
                    className="sport-card-hover group relative rounded-xl overflow-hidden bg-[#151e2b] border border-slate-800 hover:border-slate-600 cursor-pointer"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={st.image}
                        alt={st.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#151e2b] via-slate-950/35 to-transparent" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <QrCode className="w-3 h-3" /> BOPIS Activo
                      </div>
                      <div className="absolute bottom-3 inset-x-4">
                        <h3 className="font-bold text-base text-white">{st.name}</h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" /> {st.city} • {st.capacity}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 space-y-1 text-xs">
                      <div className="text-slate-300">
                        <strong className="text-white">Sede de:</strong> {st.homeTeams}
                      </div>
                      <div className="text-emerald-400 font-medium">{st.bopisGates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ==================== VIEW 2: ESTADIOS & EQUIPOS ==================== */}
      {activeTab === 'stadiums' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Directorio Oficial • {currentLeagueObj.name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Franquicias, Selecciones y Estadios Oficiales
              </h2>
            </div>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold self-start"
            >
              Cambiar Equipo Favorito
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className="rounded-xl overflow-hidden bg-[#151e2b] border border-slate-800 hover:border-slate-600 transition cursor-pointer"
              >
                <div className="relative h-44">
                  <img src={team.image} alt={team.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151e2b] via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg border border-slate-200 shrink-0">
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{team.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold">{team.titles}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Sede Oficial:</span>
                    <strong className="text-white">{team.stadium}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Récord Actual:</span>
                    <strong className="text-emerald-400">
                      {team.record} ({team.streak})
                    </strong>
                  </div>
                  <p className="text-slate-400 pt-2 border-t border-slate-800">
                    {team.promoMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== VIEW 3: BOPIS & MARKETPLACE COMPLETO ==================== */}
      {activeTab === 'bopis' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#151e2b] to-[#151e2b] border border-emerald-500/30 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                <QrCode className="w-3.5 h-3.5" /> Buy Online, Pick Up In Stadium (BOPIS)
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tienda Oficial y Pedidos en el Estadio Sin Filas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Adquiere jerseys oficiales de las Águilas, Licey, Reinas del Caribe, gorras 59FIFTY o comida del estadio y retira en la Ventanilla Fast-Track con código QR dinámico.
              </p>
            </div>
            <button
              onClick={() => setIsBopisModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shrink-0 shadow-xl"
            >
              <QrCode className="w-5 h-5" />
              Abrir Pase QR Dinámico ({totalCartItems})
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Todo el Catálogo' },
              { id: 'merch', label: 'Jerseys & Gorras Oficiales' },
              { id: 'food', label: 'Comida & Bebidas en Estadio (BOPIS)' },
              { id: 'tickets', label: 'Boletas Digitales QR' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setBopisCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition shrink-0 ${
                  bopisCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#151e2b] text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBopisItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl overflow-hidden bg-[#151e2b] border border-slate-800 hover:border-slate-600 flex flex-col justify-between transition"
              >
                <div>
                  <div className="relative">
                    <ProductVisual item={item} className="h-52" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/85 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                      {item.categoryLabel}
                    </div>
                    <h3 className="font-bold text-base text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                    <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {item.pickupGate}
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-white">
                    RD$ {item.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" /> Agregar al QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== VIEW 4: ESTADÍSTICAS EN TIEMPO REAL ==================== */}
      {activeTab === 'stats' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-xl bg-[#151e2b] border border-slate-800 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Statcast Dominicano en Tiempo Real
              </span>
              <h3 className="text-xl font-bold text-white">{heroGame.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {heroGame.arMetrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] uppercase text-slate-400 font-bold">{m.label}</div>
                    <div className="text-lg font-extrabold text-white mt-0.5">{m.value}</div>
                    <div className="text-[11px] text-emerald-400">{m.delta}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePlayGame(heroGame.id)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
              >
                Abrir Superposición AR en el Reproductor En Vivo
              </button>
            </div>

            <div className="lg:col-span-2 rounded-xl bg-[#151e2b] border border-slate-800 p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Tabla de Posiciones LIDOM (Tiempo Real)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase">
                      <th className="py-3 px-2">Pos</th>
                      <th className="py-3 px-2">Equipo</th>
                      <th className="py-3 px-2 text-center">JJ</th>
                      <th className="py-3 px-2 text-center">G</th>
                      <th className="py-3 px-2 text-center">P</th>
                      <th className="py-3 px-2 text-center">PCT</th>
                      <th className="py-3 px-2 text-center">DIF</th>
                      <th className="py-3 px-2 text-center">Racha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {STANDINGS_LIDOM.map((row) => (
                      <tr key={row.pos} className="hover:bg-slate-800/40">
                        <td className="py-3 px-2 font-bold text-slate-400">{row.pos}</td>
                        <td className="py-3 px-2 font-bold text-white">{row.team}</td>
                        <td className="py-3 px-2 text-center">{row.jj}</td>
                        <td className="py-3 px-2 text-center text-emerald-400 font-bold">{row.g}</td>
                        <td className="py-3 px-2 text-center text-rose-400">{row.p}</td>
                        <td className="py-3 px-2 text-center font-mono font-bold">{row.pct}</td>
                        <td className="py-3 px-2 text-center text-slate-400">{row.dif}</td>
                        <td className="py-3 px-2 text-center font-bold text-amber-400">{row.racha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== VIEW 5: PLANES SVOD & PPV ==================== */}
      {activeTab === 'plans' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-bold uppercase">
              Monetización Mixta SVOD + PPV
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Planes de Suscripción y Pago Por Evento
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = userPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 border flex flex-col justify-between ${
                    plan.highlighted
                      ? 'bg-[#172334] border-blue-500 ring-1 ring-blue-500'
                      : 'bg-[#151e2b] border-slate-800'
                  }`}
                >
                  <div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                      {plan.badge}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-3">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-xs text-slate-400">{plan.period}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{plan.description}</p>
                    <ul className="mt-5 space-y-2.5 text-xs text-slate-200">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setUserPlan(plan.id)}
                    className={`w-full mt-6 py-3 rounded-xl font-bold text-xs transition ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isSelected ? 'Plan Activo en tu Cuenta' : `Seleccionar ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== VIEW 6: ECOSISTEMA & CASO DE ESTUDIO ==================== */}
      {activeTab === 'case' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8">
          <BusinessCaseView
            selectedTeam={selectedTeam}
            onNavigateTab={(tab) => setActiveTab(tab === 'live' ? 'home' : tab)}
          />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0f141c]/95 backdrop-blur-xl border-t border-slate-800 px-2 py-2">
        <div className="grid grid-cols-6 gap-1">
          {menuLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold truncate transition ${
                activeTab === item.id ? 'text-white bg-blue-600' : 'text-slate-400'
              }`}
            >
              {item.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      <TeamProfileModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        selectedTeamId={selectedTeamId}
        onSelectTeam={(id) => setSelectedTeamId(id)}
      />

      <LiveStreamModal
        isOpen={isStreamModalOpen}
        onClose={() => setIsStreamModalOpen(false)}
        game={heroGame}
        selectedTeam={selectedTeam}
        onAddToCart={handleAddToCart}
        onOpenBopis={() => {
          setIsStreamModalOpen(false);
          setIsBopisModalOpen(true);
        }}
        totalCartItems={totalCartItems}
      />

      <BopisModal
        isOpen={isBopisModalOpen}
        onClose={() => setIsBopisModalOpen(false)}
        cart={cart}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        selectedTeam={selectedTeam}
        userPlan={userPlan}
      />
    </div>
  );
}
