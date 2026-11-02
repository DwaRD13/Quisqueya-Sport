import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Chips, EmptyState, PageHeader } from '../../shared/ui.jsx';
import { LEAGUES } from '../../data/catalog.js';
import { VIDEOS } from '../../data/videos.js';
import VideoPlayer from './VideoPlayer.jsx';

export default function VideosPage() {
  const [params, setParams] = useSearchParams();
  const league = params.get('liga') ?? 'all';
  const list = useMemo(
    () => VIDEOS.filter((v) => league === 'all' || v.league === league).sort((a, b) => b.date.localeCompare(a.date)),
    [league],
  );
  return (
    <div>
      <PageHeader eyebrow="Resúmenes y jugadas" title="Videos">
        <p className="max-w-2xl text-sm text-muted">Solo resúmenes con imágenes reales de los partidos (transmisión de TV), publicados en YouTube por canales de los clubes y medios independientes.</p>
      </PageHeader>
      <div className="mb-6">
        <Chips label="Liga" options={LEAGUES} value={league} onChange={(id) => setParams(id === 'all' ? {} : { liga: id })} />
      </div>
      {list.length ? (
        <VideoPlayer key={league} videos={list} />
      ) : (
        <EmptyState title="Sin videos" body="No encontramos videos embebibles para esta liga todavía." />
      )}
    </div>
  );
}
