import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { Img } from '../../shared/ui.jsx';
import { formatDay, statusLabel, winner } from './games.js';
import { VIDEOS } from '../../data/videos.js';

export function TeamLogo({ team, size = 40 }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white/95 p-1" style={{ width: size, height: size }}>
      <Img src={team.logo} alt={`Logo ${team.name}`} fit="contain" className="h-full w-full" label={team.abbr} />
    </span>
  );
}

function Row({ team, won, final }) {
  return (
    <div className="flex items-center justify-between gap-3 border-l-4 px-4 py-3" style={{ borderColor: team.color }}>
      <span className="flex min-w-0 items-center gap-3">
        <TeamLogo team={team} size={32} />
        <span className="truncate font-semibold">{team.name}</span>
      </span>
      <span className={`font-mono text-2xl font-bold ${won ? 'text-lights' : 'text-muted'}`}>{final ? team.runs : '–'}</span>
    </div>
  );
}

export default function GameCard({ game }) {
  const w = winner(game);
  const final = game.status === 'final';
  const hasVideo = VIDEOS.some((v) => v.gameId === game.id);
  return (
    <Link to={`/partidos/${game.id}`} className="card group flex flex-col overflow-hidden transition hover:ring-1 hover:ring-edge">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-xs font-bold text-muted">
        <span className={game.status === 'postponed' ? 'text-red-soft' : ''}>{statusLabel(game)}</span>
        <span className="flex items-center gap-2">
          {hasVideo && <PlayCircle size={14} className="text-red" aria-label="Con video" />}
          {formatDay(game.date).toUpperCase()}
        </span>
      </div>
      <Row team={game.away} won={w === 'away'} final={final} />
      <Row team={game.home} won={w === 'home'} final={final} />
    </Link>
  );
}
