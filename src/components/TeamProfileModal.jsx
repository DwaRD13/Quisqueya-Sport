import React, { useState } from 'react';
import { X, Sparkles, Check, MapPin, Trophy } from 'lucide-react';
import { TEAMS, LEAGUES } from '../data/mockData';

export default function TeamProfileModal({
  isOpen,
  onClose,
  selectedTeamId,
  onSelectTeam,
}) {
  const [filterLeague, setFilterLeague] = useState('all');

  if (!isOpen) return null;

  const visibleTeams =
    filterLeague === 'all'
      ? TEAMS
      : TEAMS.filter((t) => t.league === filterLeague);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#141c27] border border-slate-700/80 p-6 sm:p-8 shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-2xl mx-auto mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" /> Perfil Único • Personalización Deportiva
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Selecciona tu Equipo o Selección Oficial
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Personaliza la cartelera de partidos en vivo, promociones BOPIS en el estadio y estadísticas según tu equipo favorito.
          </p>
        </div>

        {/* League Filter Tabs inside Modal */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {LEAGUES.map((lg) => (
            <button
              key={lg.id}
              onClick={() => setFilterLeague(lg.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                filterLeague === lg.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {lg.shortLabel}
            </button>
          ))}
        </div>

        {/* Team Cards Grid with Official Team Logos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {visibleTeams.map((team) => {
            const isSelected = team.id === selectedTeamId;
            return (
              <div
                key={team.id}
                onClick={() => {
                  onSelectTeam(team.id);
                  onClose();
                }}
                className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/50 bg-slate-900'
                    : 'border-slate-800 hover:border-slate-600 bg-slate-900/80'
                }`}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={team.image}
                    alt={team.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" />

                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-950/85 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-slate-200 border border-slate-700">
                      {team.leagueName} • {team.city}
                    </span>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Official Team Logo + Name */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 shadow-xl border-2 border-white/90 flex items-center justify-center shrink-0">
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-white leading-tight truncate">
                        {team.name}
                      </h4>
                      <div className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                        <span className="truncate">{team.stadium}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Trophy className="w-3.5 h-3.5" /> {team.titles}
                  </span>
                  <span className="font-mono text-white font-bold">
                    {team.record} ({team.streak})
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
