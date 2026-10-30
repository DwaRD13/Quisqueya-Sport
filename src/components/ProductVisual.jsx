import React from 'react';

export default function ProductVisual({ item, className = 'h-48' }) {
  if (item.visualType === 'jersey') {
    const {
      primaryColor = '#eab308',
      secondaryColor = '#111827',
      trimColor = '#ffffff',
      textColor = '#111827',
      chestText = 'ÁGUILAS',
      number = '22',
      subPatch = 'LIDOM OFICIAL',
      pinstripes = false,
      logoUrl = '/teams/aguilas.svg',
    } = item.visualConfig || {};

    return (
      <div
        className={`relative w-full ${className} overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 select-none`}
      >
        <div
          style={{ backgroundColor: primaryColor }}
          className="absolute w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
        />

        {/* Official Team Logo Watermark/Badge in Corner */}
        {logoUrl && (
          <div className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-xl bg-white p-1.5 shadow-lg border border-slate-300 flex items-center justify-center z-10">
            <img src={logoUrl} alt={chestText} className="w-full h-full object-contain" />
          </div>
        )}

        <svg
          viewBox="0 0 260 220"
          className="w-48 h-44 drop-shadow-[0_14px_20px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id={`jerseyGrad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="65%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.85" />
            </linearGradient>
            <pattern
              id={`stripes-${item.id}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke={trimColor}
                strokeWidth="1.2"
                strokeOpacity="0.35"
              />
            </pattern>
          </defs>

          <path
            d="M98 22 Q130 34 162 22 L156 42 Q130 48 104 42 Z"
            fill="#0f172a"
            stroke={trimColor}
            strokeWidth="1.5"
          />

          <path
            d="M95 22 L48 42 L22 96 L56 112 L72 78 L72 198 Q130 206 188 198 L188 78 L204 112 L238 96 L212 42 L165 22 Q130 44 95 22 Z"
            fill={`url(#jerseyGrad-${item.id})`}
            stroke={trimColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {pinstripes && (
            <path
              d="M95 22 L48 42 L22 96 L56 112 L72 78 L72 198 Q130 206 188 198 L188 78 L204 112 L238 96 L212 42 L165 22 Q130 44 95 22 Z"
              fill={`url(#stripes-${item.id})`}
            />
          )}

          <line x1="25" y1="90" x2="58" y2="105" stroke={secondaryColor} strokeWidth="5" />
          <line x1="235" y1="90" x2="202" y2="105" stroke={secondaryColor} strokeWidth="5" />

          <path
            d="M98 24 Q130 48 130 62 L130 199"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3.5"
          />
          <path
            d="M162 24 Q130 48 130 62"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="3.5"
          />

          {[72, 96, 120, 144, 168].map((cy) => (
            <circle
              key={cy}
              cx="130"
              cy={cy}
              r="2.6"
              fill={trimColor}
              stroke="#0f172a"
              strokeWidth="0.8"
            />
          ))}

          <rect x="118" y="25" width="24" height="8" rx="2" fill="#ffffff" opacity="0.9" />
          <text x="130" y="31" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#0f172a">
            PRO-MESH
          </text>

          <text
            x="130"
            y="95"
            textAnchor="middle"
            fontSize="21"
            fontWeight="900"
            fontFamily="Roboto Condensed, sans-serif"
            letterSpacing="1.5"
            fill={textColor}
            stroke={trimColor}
            strokeWidth="0.9"
          >
            {chestText}
          </text>

          <text
            x="154"
            y="134"
            textAnchor="middle"
            fontSize="26"
            fontWeight="900"
            fontFamily="Roboto Condensed, sans-serif"
            fill={textColor}
            stroke={trimColor}
            strokeWidth="0.8"
          >
            {number}
          </text>

          <rect
            x="84"
            y="172"
            width="32"
            height="14"
            rx="2"
            fill="#0f172a"
            stroke={trimColor}
            strokeWidth="1"
          />
          <text x="100" y="181" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#ffffff">
            {subPatch}
          </text>
        </svg>
      </div>
    );
  }

  if (item.visualType === 'cap') {
    const {
      crownColor = '#dc2626',
      visorColor = '#991b1b',
      logoText = 'LE',
      subLabel = '59FIFTY OFICIAL',
      logoUrl = '/teams/escogido.png',
    } = item.visualConfig || {};

    return (
      <div
        className={`relative w-full ${className} overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 select-none`}
      >
        <div
          style={{ backgroundColor: crownColor }}
          className="absolute w-40 h-40 rounded-full blur-3xl opacity-25 pointer-events-none"
        />

        {logoUrl && (
          <div className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-xl bg-white p-1.5 shadow-lg border border-slate-300 flex items-center justify-center z-10">
            <img src={logoUrl} alt={logoText} className="w-full h-full object-contain" />
          </div>
        )}

        <svg
          viewBox="0 0 260 200"
          className="w-48 h-40 drop-shadow-[0_14px_18px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-105"
        >
          <path
            d="M52 126 C52 60, 208 60, 208 126 Z"
            fill={crownColor}
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          <path d="M130 68 L130 126" stroke="#000000" strokeWidth="1.5" strokeOpacity="0.25" />
          <path
            d="M130 68 C95 82, 82 105, 78 126"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeOpacity="0.2"
          />
          <path
            d="M130 68 C165 82, 178 105, 182 126"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeOpacity="0.2"
          />
          <ellipse cx="130" cy="67" rx="7" ry="4" fill={visorColor} />

          <text
            x="130"
            y="112"
            textAnchor="middle"
            fontSize="30"
            fontWeight="900"
            fontFamily="Roboto Condensed, sans-serif"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.2"
          >
            {logoText}
          </text>

          <path
            d="M44 124 Q130 112 216 124 L232 146 Q130 162 28 146 Z"
            fill={visorColor}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />

          <ellipse
            cx="178"
            cy="138"
            rx="16"
            ry="8"
            fill="#eab308"
            stroke="#fef08a"
            strokeWidth="1"
          />
          <text
            x="178"
            y="140"
            textAnchor="middle"
            fontSize="4.8"
            fontWeight="bold"
            fill="#0f172a"
          >
            {subLabel}
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className} overflow-hidden bg-slate-900`}>
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131b26] via-transparent to-black/25" />
    </div>
  );
}
