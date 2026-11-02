import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../../shared/ui.jsx';
import { formatDay, formatTime, getGame, statusLabel, winner } from './games.js';
import { TeamLogo } from './GameCard.jsx';
import { VIDEOS } from '../../data/videos.js';
import VideoPlayer from '../videos/VideoPlayer.jsx';
import { getStadium, getTeam } from '../../data/catalog.js';

export default function GameDetail() {
  const { id } = useParams();
  const game = getGame(id);
  if (!game) {
    return <EmptyState title="Partido no encontrado" body="Puede que el enlace sea viejo." action={<Link to="/partidos" className="btn-primary">Ver partidos</Link>} />;
  }
  const final = game.status === 'final';
  const w = winner(game);
  const videos = VIDEOS.filter((v) => v.gameId === game.id);
  const stadium = getStadium(getTeam(game.home.slug)?.stadium);

  const side = (t, key) => (
    <Link to={`/equipos/${t.slug}`} className="flex flex-1 flex-col items-center gap-3 text-center">
      <TeamLogo team={t} size={88} />
      <span className="font-display text-2xl font-bold uppercase sm:text-3xl">{t.name}</span>
      <span className={`font-mono text-6xl font-bold ${w === key ? 'text-lights' : 'text-muted'}`}>{final ? t.runs : '–'}</span>
    </Link>
  );

  return (
    <div className="flex flex-col gap-10">
      <Link to="/partidos" className="text-sm font-semibold text-flag-soft">← Partidos</Link>
      <section className="card flex flex-col gap-6 p-6 sm:p-10">
        <h1 className="sr-only">{game.away.name} en {game.home.name}, {formatDay(game.date)}</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="tag bg-line">{statusLabel(game)}</span>
          <span className="tag bg-flag-deep text-flag-soft">{formatDay(game.date).toUpperCase()} · {formatTime(game.date)}</span>
          {stadium && <span className="tag bg-line text-muted">{stadium.name.toUpperCase()}</span>}
        </div>
        <div className="flex items-start gap-4">
          {side(game.away, 'away')}
          <span className="mt-8 font-mono text-xl text-faint">@</span>
          {side(game.home, 'home')}
        </div>
        {final && (
          <div className="overflow-x-auto">
            <table className="mx-auto min-w-[320px] font-mono text-sm">
              <thead className="text-muted"><tr><th className="px-4 py-2 text-left">Equipo</th><th className="px-4">C</th><th className="px-4">H</th><th className="px-4">E</th></tr></thead>
              <tbody>
                {[game.away, game.home].map((t) => (
                  <tr key={t.slug} className="border-t border-line"><td className="px-4 py-2 font-sans font-semibold">{t.name}</td><td className="px-4 text-center">{t.runs}</td><td className="px-4 text-center">{t.hits}</td><td className="px-4 text-center">{t.errors}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {final && (
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            {[['Ganador', game.winningPitcher], ['Perdedor', game.losingPitcher], ['Salvado', game.savingPitcher]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-night px-4 py-3"><dt className="text-xs text-muted">Lanzador {k.toLowerCase()}</dt><dd className="font-semibold">{v || '—'}</dd></div>
            ))}
          </dl>
        )}
        {!final && (game.away.pitcher || game.home.pitcher) && (
          <p className="text-center text-sm text-muted">Abridores probables: {game.away.pitcher || 'por anunciar'} vs {game.home.pitcher || 'por anunciar'}</p>
        )}
      </section>

      <section>
        <h2 className="h-section mb-4">Video</h2>
        {videos.length ? (
          <VideoPlayer videos={videos} />
        ) : (
          <EmptyState title="Sin video disponible" body={final ? 'No encontramos un resumen embebible de este partido.' : 'El resumen aparecerá cuando se juegue el partido.'} action={<Link to="/videos" className="btn-ghost">Ver todos los videos</Link>} />
        )}
      </section>
    </div>
  );
}
