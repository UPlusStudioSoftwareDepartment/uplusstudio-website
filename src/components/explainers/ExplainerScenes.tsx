import type { ReactNode } from "react";
import type { ExplainerId } from "@/lib/explainers";

const INK = "#ede9e1";
const MUTE = "#a29d93";
const CLAY = "#c4825c";
const PANEL = "#2a2824";

/** Numbered marker; the same number appears in the legend beside the drawing. */
function Badge({ x, y, n, className }: Readonly<{ x: number; y: number; n: number; className?: string }>) {
  return (
    <g className={className}>
      <circle cx={x} cy={y} r="13" fill={CLAY} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#121110" fontFamily="ui-monospace, monospace">
        {n}
      </text>
    </g>
  );
}

function Frame({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full" aria-hidden focusable="false">
      <rect width="480" height="300" fill="#1d1c19" />
      {children}
    </svg>
  );
}

function Imar() {
  return (
    <Frame>
      <g className="ex-s1">
        <rect x="30" y="40" width="190" height="210" fill="#2c3324" stroke="#6f8a55" strokeWidth="2" />
        <text x="44" y="238" fontSize="15" fill="#b9c9a3" fontFamily="ui-monospace, monospace">500 m²</text>
      </g>
      <rect x="30" y="256" width="190" height="16" fill="#2e2c28" />
      <path d="M40 264h20M75 264h20M110 264h20M145 264h20M180 264h20" stroke="#5b574f" strokeWidth="2" />
      <rect className="ex-s2" x="56" y="66" width="138" height="150" fill="none" stroke={INK} strokeWidth="1.6" strokeDasharray="7 6" />
      <g className="ex-s3">
        <rect x="80" y="96" width="90" height="90" fill={CLAY} fillOpacity="0.9" />
        <text x="125" y="146" textAnchor="middle" fontSize="15" fontWeight="600" fill="#121110" fontFamily="ui-monospace, monospace">150 m²</text>
      </g>

      <path d="M250 250h200" stroke={MUTE} strokeWidth="2" />
      <g className="ex-s4">
        <rect x="300" y="200" width="110" height="50" fill={CLAY} fillOpacity="0.9" stroke={INK} strokeWidth="1.5" />
        <path d="M318 214h18v18h-18zM374 214h18v18h-18z" fill="#1d1c19" />
      </g>
      <g className="ex-s5">
        <rect x="300" y="150" width="110" height="50" fill={CLAY} fillOpacity="0.6" stroke={INK} strokeWidth="1.5" />
        <path d="M318 164h18v18h-18zM374 164h18v18h-18z" fill="#1d1c19" />
        <path d="M292 150l63-34 63 34" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <text x="355" y="282" textAnchor="middle" fontSize="15" fill={INK} fontFamily="ui-monospace, monospace">2 × 150 = 300 m²</text>
      </g>

      <Badge x={30} y={40} n={1} className="ex-s1" />
      <Badge x={56} y={66} n={2} className="ex-s2" />
      <Badge x={170} y={96} n={3} className="ex-s3" />
      <Badge x={430} y={175} n={4} className="ex-s4" />
    </Frame>
  );
}

function Zemin() {
  return (
    <Frame>
      <rect y="170" width="480" height="42" fill="#5a4632" />
      <rect y="212" width="480" height="40" fill="#4a3b2c" />
      <rect y="252" width="480" height="48" fill="#3a2f24" />
      <path d="M0 170h480" stroke="#6f8a55" strokeWidth="3" />
      <g fill="#7a6650">
        <circle cx="30" cy="190" r="3" /><circle cx="160" cy="200" r="2.5" /><circle cx="420" cy="186" r="3" />
        <circle cx="120" cy="232" r="2.5" /><circle cx="300" cy="238" r="3" /><circle cx="450" cy="226" r="2.5" />
        <circle cx="60" cy="276" r="3" /><circle cx="210" cy="284" r="2.5" /><circle cx="380" cy="272" r="3" />
      </g>

      <g className="ex-s1">
        <path d="M48 170l22-62 22 62M56 148h28" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
      <path className="ex-grow" d="M70 108V286" stroke={CLAY} strokeWidth="4" strokeLinecap="round" />

      <g className="ex-shake">
        <g className="ex-s2">
          <rect x="236" y="170" width="140" height="16" fill="#8a8478" />
          <path d="M252 186v56M306 186v56M360 186v56" stroke="#8a8478" strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="ex-s3">
          <rect x="248" y="70" width="116" height="100" fill={PANEL} stroke={INK} strokeWidth="2" />
          <path d="M248 103h116M248 136h116" stroke={MUTE} strokeWidth="1.5" />
          <path d="M268 70v100M306 70v100M344 70v100" stroke={MUTE} strokeWidth="3" />
          <path d="M276 80h22v16h-22zM314 80h22v16h-22zM276 113h22v16h-22zM314 113h22v16h-22z" fill="#3b4a52" />
        </g>
      </g>
      <path className="ex-s4" d="M180 292q15-10 30 0t30 0 30 0 30 0 30 0 30 0 30 0" fill="none" stroke={CLAY} strokeWidth="2.5" strokeLinecap="round" />

      <Badge x={98} y={108} n={1} className="ex-s1" />
      <Badge x={392} y={180} n={2} className="ex-s2" />
      <Badge x={392} y={72} n={3} className="ex-s3" />
    </Frame>
  );
}

const SNOW = [
  [40, 0], [120, 1.2], [200, 2.4], [260, 0.6], [330, 1.8], [400, 3], [460, 0.9], [90, 2.8], [230, 3.4], [370, 0.3],
] as const;
const LEAK = [
  [70, 190, -34, 0], [70, 225, -34, 6], [150, 205, 36, -4], [150, 235, 36, 4], [110, 165, 0, -40], [95, 210, -30, 10],
] as const;

function Iklim() {
  return (
    <Frame>
      <g fill="#cfd8df">
        {SNOW.map(([x, delay]) => (
          <circle key={`${x}-${delay}`} className="ex-snow" cx={x} cy="12" r="2.4" style={{ animationDelay: `${delay}s` }} />
        ))}
      </g>
      <path d="M0 252h480" stroke={MUTE} strokeWidth="2" />

      <rect x="40" y="152" width="140" height="100" fill={PANEL} stroke={INK} strokeWidth="2" />
      <path d="M30 152l80-50 80 50" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="96" y="200" width="28" height="52" fill="#3b4a52" />
      <g fill="#e0763f">
        {LEAK.map(([x, y, dx, dy]) => (
          <circle
            key={`${x}-${y}`}
            className="ex-leak"
            cx={x}
            cy={y}
            r="5"
            style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, animationDelay: `${(x + y) % 7 / 5}s` } as React.CSSProperties}
          />
        ))}
      </g>

      <rect x="290" y="152" width="140" height="100" fill={PANEL} stroke={INK} strokeWidth="2" />
      <g className="ex-s2">
        <rect x="283" y="145" width="154" height="107" fill="none" stroke="#d9c38f" strokeWidth="8" />
        <path d="M276 147l84-55 84 55" fill="none" stroke="#d9c38f" strokeWidth="8" strokeLinejoin="round" />
      </g>
      <path d="M280 152l80-52 80 52" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="400" y="176" width="22" height="44" fill="#7fa6c9" />
      <g fill="#e0763f">
        <circle className="ex-bounce" cx="330" cy="200" r="5" />
        <circle className="ex-bounce" cx="360" cy="225" r="5" style={{ animationDelay: "0.4s" }} />
        <circle className="ex-bounce" cx="375" cy="190" r="5" style={{ animationDelay: "0.8s" }} />
        <circle className="ex-bounce" cx="315" cy="232" r="5" style={{ animationDelay: "1.2s" }} />
      </g>
      <g className="ex-s3">
        <circle cx="452" cy="48" r="17" fill="#f2c46b" />
        <path d="M440 64L414 182" stroke="#f2c46b" strokeWidth="2.5" strokeDasharray="6 6" />
      </g>

      <Badge x={40} y={140} n={1} />
      <Badge x={290} y={130} n={2} className="ex-s2" />
      <Badge x={420} y={96} n={3} className="ex-s3" />
    </Frame>
  );
}

const SHEETS = [
  { x: 22, color: CLAY },
  { x: 136, color: "#9aa7b5" },
  { x: 250, color: "#e3c25a" },
  { x: 364, color: "#6fa3a0" },
] as const;

function Projeler() {
  return (
    <Frame>
      <path className="ex-s5" d="M69 236C140 270 170 270 183 236S260 200 297 236 390 270 411 236" fill="none" stroke={CLAY} strokeWidth="2.5" strokeDasharray="6 6" />
      {SHEETS.map((sheet, i) => (
        <g key={sheet.x} className={`ex-s${i + 1}`}>
          <rect x={sheet.x} y="56" width="94" height="168" fill={PANEL} stroke={INK} strokeWidth="1.5" />
          <rect x={sheet.x} y="56" width="94" height="16" fill={sheet.color} />
          <g transform={`translate(${sheet.x + 15} 92)`} fill="none" stroke={sheet.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
            {i === 0 && <path d="M0 0h64v80H0zM0 40h36M36 0v58M36 58h28" />}
            {i === 1 && (
              <>
                <path d="M0 10h64M0 45h64M0 80h64" />
                <path d="M6 4v82M32 4v82M58 4v82" strokeWidth="5" />
              </>
            )}
            {i === 2 && <path d="M38 0L14 46h20L24 86l30-52H34L44 0z" fill={sheet.color} fillOpacity="0.25" />}
            {i === 3 && <path d="M0 14h40v34h24M32 62c0 10 8 16 8 22a8 8 0 0 1-16 0c0-6 8-12 8-22z" />}
          </g>
          <circle cx={sheet.x + 47} cy="236" r="5" fill={sheet.color} />
        </g>
      ))}
      {SHEETS.map((sheet, i) => (
        <Badge key={`b-${sheet.x}`} x={sheet.x + 8} y={50} n={i + 1} className={`ex-s${i + 1}`} />
      ))}
    </Frame>
  );
}

const STOPS = [
  [48, 238],
  [148, 176],
  [244, 214],
  [340, 132],
  [436, 84],
] as const;
const ROAD = `M${STOPS.map(([x, y]) => `${x} ${y}`).join(" L")}`;

function Surec() {
  return (
    <Frame>
      <path d={ROAD} fill="none" stroke="#2e2c28" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ex-path" d={ROAD} pathLength={1} fill="none" stroke={CLAY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {STOPS.map(([x, y], i) => (
        <g key={x}>
          <circle cx={x} cy={y} r="16" fill={PANEL} stroke={MUTE} strokeWidth="2" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={MUTE} fontFamily="ui-monospace, monospace">
            {i + 1}
          </text>
          <Badge x={x} y={y} n={i + 1} className={`ex-s${i + 1}`} />
        </g>
      ))}
      <g className="ex-s5">
        <path d="M418 52l18-16 18 16v18h-36z" fill={PANEL} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <rect x="431" y="58" width="10" height="12" fill={CLAY} />
      </g>
      <g className="ex-s3" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round">
        <path d="M232 160h26v30h-26z" />
        <path d="M238 170h14M238 178h10" />
      </g>
      <g className="ex-s4" stroke={MUTE} strokeWidth="2" fill="none">
        <path d="M360 194l26-40 26 40M368 182h36" />
        <path d="M386 154v-14h18" />
      </g>
    </Frame>
  );
}

const COLUMNS = [
  [40, 40], [240, 40], [440, 40], [40, 260], [240, 260], [440, 260],
] as const;

function Tadilat() {
  return (
    <Frame>
      <rect x="40" y="40" width="400" height="220" fill="#24221f" stroke={INK} strokeWidth="8" />
      <path d="M150 40v120" stroke={MUTE} strokeWidth="4" />
      <path d="M150 160h50" stroke={MUTE} strokeWidth="4" />
      <g className="ex-slide">
        <path d="M330 120v140" stroke={INK} strokeWidth="5" strokeDasharray="10 6" />
      </g>
      <rect x="352" y="48" width="80" height="62" fill="#3d5a66" />
      <circle cx="392" cy="80" r="6" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="420" y="48" width="12" height="14" fill={CLAY} />
      {COLUMNS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle className="ex-pulse" cx={x} cy={y} r="14" fill="none" stroke="#e05a4a" strokeWidth="3" />
          <rect x={x - 9} y={y - 9} width="18" height="18" fill={INK} />
        </g>
      ))}
      <Badge x={330} y={104} n={1} />
      <Badge x={264} y={66} n={2} />
      <Badge x={352} y={48} n={3} />
    </Frame>
  );
}

const SCENES: Record<ExplainerId, () => ReactNode> = {
  imar: Imar,
  zemin: Zemin,
  iklim: Iklim,
  projeler: Projeler,
  surec: Surec,
  tadilat: Tadilat,
};

export function ExplainerScene({ id }: Readonly<{ id: ExplainerId }>) {
  const Scene = SCENES[id];
  return <Scene />;
}
