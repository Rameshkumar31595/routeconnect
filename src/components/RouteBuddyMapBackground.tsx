export default function RouteBuddyMapBackground() {
  return (
    <div className="route-buddy-map" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <linearGradient id="routeBuddySky" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#eaf4f0" />
            <stop offset="1" stopColor="#d7e8e2" />
          </linearGradient>
          <pattern id="routeBuddyBlocks" width="170" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
            <rect width="170" height="150" fill="#e4efeb" />
            <rect x="12" y="14" width="55" height="36" rx="4" fill="#f8fbf9" />
            <rect x="80" y="18" width="72" height="28" rx="4" fill="#d4e4de" />
            <rect x="26" y="76" width="96" height="52" rx="4" fill="#f5faf8" />
            <rect x="137" y="77" width="21" height="47" rx="3" fill="#cedfd9" />
          </pattern>
          <filter id="routeBuddyShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0d5448" floodOpacity="0.16" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill="url(#routeBuddySky)" />
        <path d="M-60 620 C210 470 240 820 490 650 S760 430 920 610 S1240 780 1680 420 L1680 950 L-60 950Z" fill="#c7e2dc" opacity=".85" />
        <path d="M-60 640 C210 490 240 840 490 670 S760 450 920 630 S1240 800 1680 440" fill="none" stroke="#f8fffd" strokeWidth="17" opacity=".95" />
        <rect x="-80" y="-80" width="1760" height="980" fill="url(#routeBuddyBlocks)" opacity=".76" />

        <g fill="none" stroke="#ffffff" strokeLinecap="round" opacity=".9">
          <path d="M-30 180 C270 120 390 310 650 215 S1080 105 1640 240" strokeWidth="30" />
          <path d="M80 870 C220 650 370 520 520 260 S980 80 1420 -40" strokeWidth="24" />
          <path d="M-20 350 C300 420 500 390 760 480 S1190 590 1630 540" strokeWidth="18" />
        </g>
        <g fill="none" stroke="#b7cbc5" strokeLinecap="round" opacity=".9">
          <path d="M-30 180 C270 120 390 310 650 215 S1080 105 1640 240" strokeWidth="2" />
          <path d="M80 870 C220 650 370 520 520 260 S980 80 1420 -40" strokeWidth="2" />
          <path d="M-20 350 C300 420 500 390 760 480 S1190 590 1630 540" strokeWidth="2" />
        </g>

        <g fill="none" stroke="#146b5b" strokeWidth="5" strokeDasharray="2 18" strokeLinecap="round" opacity=".82">
          <path d="M165 700 C270 590 340 560 470 515 C605 468 640 340 760 300 C910 250 1000 345 1100 410 C1190 468 1270 410 1400 245" />
        </g>
        <g fill="#146b5b">
          <path d="M390 548 l28 7 -23 17z" />
          <path d="M710 322 l27 12 -27 12z" />
          <path d="M1070 417 l27 4 -19 19z" />
          <path d="M1295 368 l24 -14 -2 28z" />
        </g>

        <g filter="url(#routeBuddyShadow)">
          <g transform="translate(130 665)">
            <circle r="24" fill="#146b5b" stroke="#ffffff" strokeWidth="7" />
            <circle r="7" fill="#ffffff" />
          </g>
          <g transform="translate(1400 220)">
            <path d="M0 -34 C-21 -34 -36 -18 -36 3 C-36 30 0 55 0 55 S36 30 36 3 C36 -18 21 -34 0 -34Z" fill="#e5a93d" stroke="#ffffff" strokeWidth="7" />
            <path d="M0 -17 L5 -5 L18 -4 L8 5 L11 18 L0 11 L-11 18 L-8 5 L-18 -4 L-5 -5Z" fill="#ffffff" />
          </g>
        </g>

        <g fill="#2c7a6a" stroke="#ffffff" strokeWidth="4" opacity=".95">
          <path d="M650 286 l-13 -21 7 -26 24 -14 25 13 7 26 -14 22z" />
          <path d="M1085 420 l-13 -21 7 -26 24 -14 25 13 7 26 -14 22z" />
          <path d="M465 520 l-13 -21 7 -26 24 -14 25 13 7 26 -14 22z" />
        </g>

        <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#routeBuddyShadow)">
          <g transform="translate(300 585)">
            <rect x="-34" y="-20" width="68" height="40" rx="10" fill="#247c6b" />
            <rect x="-24" y="-13" width="19" height="12" rx="3" fill="#c8ece4" /><rect x="5" y="-13" width="19" height="12" rx="3" fill="#c8ece4" />
            <circle cx="-20" cy="22" r="7" fill="#253f3b" /><circle cx="20" cy="22" r="7" fill="#253f3b" />
          </g>
          <g transform="translate(560 440)">
            <rect x="-45" y="-18" width="90" height="36" rx="9" fill="#d88448" />
            <rect x="-31" y="-10" width="18" height="12" rx="3" fill="#ffe8bc" /><rect x="-6" y="-10" width="18" height="12" rx="3" fill="#ffe8bc" /><rect x="19" y="-10" width="18" height="12" rx="3" fill="#ffe8bc" />
            <circle cx="-28" cy="20" r="7" fill="#253f3b" /><circle cx="28" cy="20" r="7" fill="#253f3b" />
          </g>
          <g transform="translate(970 350)">
            <path d="M-12 20 L-32 8 0 -34 31 8 10 20Z" fill="#e5a93d" /><path d="M-18 8 h36 v19 h-36z" fill="#2b6e62" /><circle cx="-22" cy="30" r="6" fill="#253f3b" /><circle cx="22" cy="30" r="6" fill="#253f3b" />
          </g>
          <g transform="translate(1195 390)" fill="none">
            <circle cx="0" cy="-20" r="8" fill="#e5a93d" /><path d="M0 -11 L-5 16 M-5 16 L-19 31 M-5 16 L14 27 M-4 1 L16 8" stroke="#146b5b" strokeWidth="8" />
          </g>
        </g>

        <g fill="#146b5b" opacity=".45">
          <rect x="190" y="220" width="80" height="10" rx="5" /><rect x="285" y="220" width="45" height="10" rx="5" />
          <rect x="1230" y="620" width="110" height="10" rx="5" /><rect x="1360" y="620" width="60" height="10" rx="5" />
        </g>
      </svg>
      <div className="route-buddy-title">RouteBuddy <span>— No Destination is Unreachable</span></div>
    </div>
  );
}