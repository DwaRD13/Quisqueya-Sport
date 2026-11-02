import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';

// Remote image with a visual fallback when the URL fails or is missing.
// Keyed by src so the failed state resets when a reused instance gets a new URL.
export function Img(props) {
  return <RemoteImg key={props.src ?? 'none'} {...props} />;
}

function RemoteImg({ src, alt, className = '', fit = 'cover', label }) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return (
      <div role="img" aria-label={alt} className={`ph-stripes flex flex-col items-center justify-center gap-2 text-faint ${className}`}>
        <ImageOff size={22} aria-hidden="true" />
        <span className="px-3 text-center font-mono text-[11px]">{label ?? alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
    />
  );
}

export function SectionHeader({ title, to, linkLabel = 'Ver todo', children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="h-section">{title}</h2>
      {children}
      {to && <Link to={to} className="text-sm font-semibold text-flag-soft hover:text-white">{linkLabel} →</Link>}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="font-display text-2xl font-bold uppercase">{title}</p>
      {body && <p className="max-w-md text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}

export function Chips({ options, value, onChange, label }) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar flex gap-2 overflow-x-auto">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)} className={value === o.id ? 'chip-on' : 'chip-off'}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }) {
  return (
    <header className="mb-8 flex flex-col gap-3">
      {eyebrow && <span className="font-mono text-xs font-bold tracking-[2px] text-red">{eyebrow}</span>}
      <h1 className="h-display text-5xl sm:text-7xl">{title}</h1>
      {children}
    </header>
  );
}

export const money = (n) => `RD$ ${Number(n).toLocaleString('es-DO')}`;

export function Field({ label, error, hint, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {label}
      {children}
      {error ? <span className="text-xs font-normal text-red-soft">{error}</span> : hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export const inputClass = 'h-12 rounded-xl border border-edge bg-night px-3 font-normal text-chalk placeholder:text-faint aria-[invalid=true]:border-red';
