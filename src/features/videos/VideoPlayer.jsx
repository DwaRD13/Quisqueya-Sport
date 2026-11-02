import { useState } from 'react';
import { embed, thumb } from '../../data/videos.js';
import { formatDay } from '../games/games.js';
import { Img } from '../../shared/ui.jsx';

// Official YouTube iframe player; the playlist strip switches the active video.
export default function VideoPlayer({ videos, initial = 0 }) {
  const [index, setIndex] = useState(initial);
  const video = videos[index] ?? videos[0];
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl bg-black">
        <iframe
          key={video.id}
          className="aspect-video w-full"
          src={embed(video.id)}
          title={video.title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div>
        <p className="text-lg font-semibold">{video.title}</p>
        <p className="text-sm text-muted">{video.channel} · {formatDay(video.date)} · <a className="text-flag-soft underline" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">Abrir en YouTube</a></p>
      </div>
      {videos.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {videos.map((v, i) => (
            <button key={v.id} type="button" onClick={() => setIndex(i)} aria-pressed={i === index} className={`w-56 shrink-0 overflow-hidden rounded-xl text-left ring-2 ${i === index ? 'ring-red' : 'ring-transparent'}`}>
              <Img src={thumb(v.id)} alt={v.title} className="aspect-video w-full" />
              <span className="block truncate bg-dugout px-3 py-2 text-xs font-semibold">{v.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
