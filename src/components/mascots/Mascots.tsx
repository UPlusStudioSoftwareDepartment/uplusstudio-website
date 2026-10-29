"use client";

import { useRef, useState } from "react";
import { m, useInView, useReducedMotion, type Transition } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";


export const HIGH_FIVE = {
  duration: 1.8,
  times: [0, 0.12, 0.3, 0.36, 0.48, 0.54, 0.74, 0.86, 1],
  contact: 0.36,
};

export type MascotPose = "idle" | "wave" | "cheer" | "think" | "highfive";

interface MascotProps {
  pose?: MascotPose;
  joy?: boolean;
  className?: string;
  offset?: number;
}

const loop = (duration: number, delay = 0, extra: Partial<Transition> = {}): Transition => ({
  duration,
  delay,
  repeat: Infinity,
  ease: "easeInOut",
  ...extra,
});

// Loops run only while the mascot is on screen; off screen it rests on its first keyframe so the main thread stays idle.
const play = (live: boolean, keyframes: Record<string, number[]>, transition: Transition) =>
  live ? { animate: keyframes, transition } : { animate: Object.fromEntries(Object.entries(keyframes).map(([key, frames]) => [key, frames[0]])), transition: { duration: 0 } };

function useOnScreen() {
  const ref = useRef<SVGSVGElement>(null);
  return [ref, useInView(ref, { margin: "80px" })] as const;
}

function useMotionProps(reduce: boolean | null, live: boolean) {
  return {
    breathe: (offset: number) =>
      reduce ? {} : play(live, { y: [0, -3, 0], scaleY: [1, 1.02, 1] }, loop(2.6, offset)),
    smileOpen: (offset: number) =>
      reduce ? {} : play(live, { opacity: [1, 1, 0, 0, 1] }, loop(4.6, offset, { times: [0, 0.55, 0.6, 0.88, 0.93], ease: "linear" })),
    smileHappy: (offset: number) =>
      reduce
        ? { initial: { opacity: 0 } }
        : { initial: { opacity: 0 }, ...play(live, { opacity: [0, 0, 1, 1, 0] }, loop(4.6, offset, { times: [0, 0.55, 0.6, 0.88, 0.93], ease: "linear" })) },
    blush: (offset: number) =>
      reduce ? {} : play(live, { opacity: [0.6, 0.6, 0.95, 0.95, 0.6] }, loop(4.6, offset, { times: [0, 0.55, 0.6, 0.88, 0.93], ease: "linear" })),
    sway: (offset: number, deg = 8) =>
      reduce ? {} : play(live, { rotate: [-deg, deg, -deg] }, loop(2.8, offset)),
  };
}

function armMotion(pose: MascotPose, reduce: boolean | null, live: boolean, offset: number, side: 1 | -1 = 1) {
  if (pose === "highfive" && !reduce) {
    return {
      animate: { rotate: [0, 22, -112, -118, -112, -110, -40, 0, 0].map((d) => d * side) },
      transition: { duration: HIGH_FIVE.duration, times: HIGH_FIVE.times, ease: "easeInOut" as const },
    };
  }
  if (reduce) return {};
  if (pose === "wave") return play(live, { rotate: [0, -38, -12, -38, 0] }, loop(1.6, offset, { repeatDelay: 0.6 }));
  if (pose === "cheer") return play(live, { rotate: [-120, -150, -120] }, loop(0.9, offset));
  if (pose === "think") return play(live, { rotate: [-70, -76, -70] }, loop(2.4, offset));
  return play(live, { rotate: [0, -6, 0] }, loop(2.6, offset));
}

function hammerTap(reduce: boolean | null, live: boolean, offset: number) {
  if (reduce) return {};
  return play(live, { rotate: [0, 0, -28, 6, 0] }, loop(2.2, offset, { times: [0, 0.55, 0.72, 0.84, 1], repeatDelay: 0.8 }));
}


export function DesignerMascot({ pose = "idle", joy = false, className = "", offset = 0 }: Readonly<MascotProps>) {
  const reduce = useReducedMotion();
  const [ref, live] = useOnScreen();
  const moves = useMotionProps(reduce, live);
  const joyful = joy || pose === "highfive";
  const cheerJump = pose === "cheer" && !reduce ? play(live, { y: [0, -8, 0] }, loop(0.9, offset)) : {};

  return (
    <svg ref={ref} viewBox="0 0 140 150" overflow="visible" className={className} aria-hidden>
      <ellipse cx="70" cy="142" rx="34" ry="5" fill="#000" opacity="0.18" />
      <m.g {...cheerJump}>
        <m.g style={{ transformBox: "view-box", originX: "100px", originY: "120px" }} {...moves.sway(offset, 9)}>
          <path d="M98 122 C 126 120, 132 96, 120 84 C 114 78, 108 84, 112 90" stroke="#f3dfc1" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M113 89 C 110 86, 112 82, 116 82" stroke="#e7a978" strokeWidth="10" strokeLinecap="round" fill="none" />
        </m.g>

        <m.g style={{ transformBox: "view-box", originX: "70px", originY: "140px" }} {...moves.breathe(offset)}>
          <ellipse cx="70" cy="113" rx="39" ry="30" fill="#f3dfc1" />
          <ellipse cx="70" cy="119" rx="25" ry="18" fill="#fbefdc" />
          <g>
            <ellipse cx="51" cy="139" rx="13" ry="7" fill="#ee8fa3" />
            <ellipse cx="47" cy="137" rx="5" ry="2.2" fill="#f6b7c4" />
            <path d="M43 135.5 q8 -4.5 16 0" stroke="#d96f88" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="57" cy="135" r="1.5" fill="#fff" />
            <ellipse cx="89" cy="139" rx="13" ry="7" fill="#ee8fa3" />
            <ellipse cx="85" cy="137" rx="5" ry="2.2" fill="#f6b7c4" />
            <path d="M81 135.5 q8 -4.5 16 0" stroke="#d96f88" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <circle cx="95" cy="135" r="1.5" fill="#fff" />
          </g>

          <g transform="rotate(-24 40 112)">
            <rect x="12" y="106" width="44" height="10" rx="1.5" fill="#7cc4c0" />
            <path d="M17 106 v4 M22 106 v6 M27 106 v4 M32 106 v6 M37 106 v4 M42 106 v6 M47 106 v4 M52 106 v6" stroke="#3f8f8a" strokeWidth="1.1" />
          </g>
          <ellipse cx="44" cy="112" rx="8" ry="7" fill="#f3dfc1" />

          <m.g style={{ transformBox: "view-box", originX: "96px", originY: "106px" }} {...armMotion(pose, reduce, live, offset)}>
            <ellipse cx="103" cy="112" rx="8" ry="10" fill="#f3dfc1" />
            <ellipse cx="104" cy="118" rx="4" ry="2.5" fill="#f4b6b8" opacity="0.7" />
          </m.g>


          <g>
            <path d="M28 52 L 34 16 Q 36 10 42 13 L 62 33 Z" fill="#f3dfc1" />
            <path d="M39 41 L 41 21 L 53 33 Z" fill="#f2b8b4" />
            <path d="M112 52 L 106 16 Q 104 10 98 13 L 78 33 Z" fill="#f3dfc1" />
            <path d="M101 41 L 99 21 L 87 33 Z" fill="#f2b8b4" />
            <ellipse cx="70" cy="63" rx="45" ry="37" fill="#f3dfc1" />
            <g transform="translate(86 26) rotate(14)">
              <path d="M-2 4 L -9 22 L -4 20 L -1 25 Z" fill="#e1748c" />
              <path d="M2 4 L 9 22 L 4 20 L 1 25 Z" fill="#e1748c" />
              <path d="M0 0 C -6 -10, -20 -10, -19 1 C -18 10, -6 7, 0 0 Z" fill="#f08aa2" />
              <path d="M0 0 C 6 -10, 20 -10, 19 1 C 18 10, 6 7, 0 0 Z" fill="#f08aa2" />
              <path d="M-4 -1 C -8 -5, -14 -5, -15 0" stroke="#fbc3d0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <ellipse cx="0" cy="0.5" rx="4.2" ry="4.6" fill="#e1748c" />
            </g>
            <path d="M44 44 Q 50 32 62 33 Q 57 41 58 49 Q 50 47 44 44 Z" fill="#e7a978" opacity="0.85" />
            <ellipse cx="70" cy="76" rx="12" ry="8.5" fill="#fbefdc" />
            <m.g {...(joyful ? { animate: { opacity: 0 }, transition: { duration: 0.12 } } : moves.smileOpen(offset + 0.3))}>
              <ellipse cx="54" cy="62" rx="5.6" ry="6.6" fill="#3a2a22" />
              <circle cx="52.2" cy="59.5" r="2" fill="#fff" />
              <circle cx="55.2" cy="64" r="0.9" fill="#fff" opacity="0.8" />
              <ellipse cx="86" cy="62" rx="5.6" ry="6.6" fill="#3a2a22" />
              <circle cx="84.2" cy="59.5" r="2" fill="#fff" />
              <circle cx="87.2" cy="64" r="0.9" fill="#fff" opacity="0.8" />
            </m.g>
            <m.g {...(joyful ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.12 } } : moves.smileHappy(offset + 0.3))}>
              <path d="M49 64 Q 54 57 59 64" stroke="#3a2a22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d="M81 64 Q 86 57 91 64" stroke="#3a2a22" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </m.g>
            <m.g {...(joyful ? { animate: { opacity: 1 }, transition: { duration: 0.2 } } : moves.blush(offset + 0.3))} opacity={0.7}>
              <ellipse cx="44" cy="73" rx="8.5" ry="5.5" fill="#f4a9ae" />
              <ellipse cx="96" cy="73" rx="8.5" ry="5.5" fill="#f4a9ae" />
            </m.g>
            <path d="M67.5 71 h5 l-2.5 2.8 Z" fill="#e58f9b" />
            <path d="M64.5 75.5 q2.75 3 5.5 0 q2.75 3 5.5 0" stroke="#5a3f33" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M28 70 l12 1.5 M29 77 l11 -1 M112 70 l-12 1.5 M111 77 l-11 -1" stroke="#d9c4a6" strokeWidth="1.3" strokeLinecap="round" />
            {joyful && (
              <g>
                <path d="M62.5 74.5 Q 70 89 77.5 74.5 Z" fill="#5a3f33" />
                <path d="M66 81.5 Q 70 86.5 74 81.5 Q 70 83 66 81.5 Z" fill="#f08aa2" />
              </g>
            )}
          </g>
        </m.g>
      </m.g>
      {pose === "think" && <ThinkMark y={8} offset={offset} reduce={reduce} live={live} />}
    </svg>
  );
}


export function BuilderMascot({ pose = "idle", joy = false, className = "", offset = 0.4 }: Readonly<MascotProps>) {
  const reduce = useReducedMotion();
  const [ref, live] = useOnScreen();
  const moves = useMotionProps(reduce, live);
  const joyful = joy || pose === "highfive";
  const cheerJump = pose === "cheer" && !reduce ? play(live, { y: [0, -8, 0] }, loop(0.9, offset)) : {};

  return (
    <svg ref={ref} viewBox="0 0 140 150" overflow="visible" className={className} aria-hidden>
      <ellipse cx="70" cy="142" rx="34" ry="5" fill="#000" opacity="0.18" />
      <m.g {...cheerJump}>
        <m.g style={{ transformBox: "view-box", originX: "40px", originY: "122px" }} {...moves.sway(offset, 6)}>
          <circle cx="38" cy="124" r="8" fill="#9c5a33" />
        </m.g>

        <m.g style={{ transformBox: "view-box", originX: "70px", originY: "140px" }} {...moves.breathe(offset)}>
          <ellipse cx="70" cy="112" rx="47" ry="33" fill="#b46a3e" />
          <ellipse cx="70" cy="117" rx="32" ry="23" fill="#f1d8bc" />
          <ellipse cx="62" cy="110" rx="12" ry="6" fill="#fbecd9" opacity="0.7" />
          <path d="M67.5 122 q2.5 2.6 5 0" stroke="#c9946a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="48" cy="140" rx="12" ry="6.5" fill="#7a4527" />
          <ellipse cx="92" cy="140" rx="12" ry="6.5" fill="#7a4527" />

          <m.g style={{ transformBox: "view-box", originX: "98px", originY: "114px" }} {...hammerTap(reduce, live, offset)}>
            <g transform="rotate(58 98 114)">
            <rect x="95.5" y="84" width="5" height="34" rx="2.2" fill="#c98b4f" />
            <path d="M96.5 90 v24" stroke="#a96f3b" strokeWidth="1" />
            <rect x="86" y="78" width="25" height="10" rx="2.5" fill="#8f99a3" />
            <rect x="86" y="78" width="6" height="10" rx="2" fill="#6f7983" />
            <rect x="106" y="79.5" width="5" height="7" rx="1.5" fill="#b5bec6" />
            </g>
          </m.g>
          <ellipse cx="97" cy="112" rx="8" ry="7" fill="#7a4527" />

          <m.g style={{ transformBox: "view-box", originX: "44px", originY: "106px" }} {...armMotion(pose, reduce, live, offset, -1)}>
            <ellipse cx="37" cy="112" rx="8" ry="10" fill="#7a4527" transform="scale(-1 1) translate(-74 0)" />
            <ellipse cx="36" cy="118" rx="4" ry="2.5" fill="#c98b6a" opacity="0.8" />
          </m.g>


          <g>
            <circle cx="33" cy="36" r="15" fill="#b46a3e" />
            <circle cx="33" cy="36" r="8" fill="#e3a77c" />
            <circle cx="107" cy="36" r="15" fill="#b46a3e" />
            <circle cx="107" cy="36" r="8" fill="#e3a77c" />
            <ellipse cx="70" cy="62" rx="45" ry="36" fill="#b46a3e" />
            <ellipse cx="70" cy="77" rx="17" ry="12" fill="#f1d8bc" />
            <g>
              <path d="M38 40 Q 40 14 70 13 Q 100 14 102 40 Z" fill="#f4c544" />
              <rect x="33" y="38" width="74" height="7" rx="3.5" fill="#e5b232" />
              <rect x="66" y="13" width="8" height="26" rx="3" fill="#ffd968" />
            </g>
            <m.g {...(joyful ? { animate: { opacity: 0 }, transition: { duration: 0.12 } } : moves.smileOpen(offset + 0.9))}>
              <ellipse cx="56" cy="62" rx="5.6" ry="6.6" fill="#2e211a" />
              <circle cx="54.2" cy="59.5" r="2" fill="#fff" />
              <circle cx="57.2" cy="64" r="0.9" fill="#fff" opacity="0.8" />
              <ellipse cx="84" cy="62" rx="5.6" ry="6.6" fill="#2e211a" />
              <circle cx="82.2" cy="59.5" r="2" fill="#fff" />
              <circle cx="85.2" cy="64" r="0.9" fill="#fff" opacity="0.8" />
            </m.g>
            <m.g {...(joyful ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.12 } } : moves.smileHappy(offset + 0.9))}>
              <path d="M51 64 Q 56 57 61 64" stroke="#2e211a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d="M79 64 Q 84 57 89 64" stroke="#2e211a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
            </m.g>
            <m.g {...(joyful ? { animate: { opacity: 1 }, transition: { duration: 0.2 } } : moves.blush(offset + 0.9))} opacity={0.6}>
              <ellipse cx="45" cy="74" rx="8.5" ry="5.5" fill="#f39a8a" />
              <ellipse cx="95" cy="74" rx="8.5" ry="5.5" fill="#f39a8a" />
            </m.g>
            <ellipse cx="70" cy="72" rx="4" ry="3" fill="#2e211a" />
            <path d="M65 77 q2.5 3 5 0 q2.5 3 5 0" stroke="#2e211a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            {joyful && (
              <g>
                <path d="M62.5 76 Q 70 91 77.5 76 Z" fill="#2e211a" />
                <path d="M66 83 Q 70 88 74 83 Q 70 84.5 66 83 Z" fill="#e8838f" />
              </g>
            )}
          </g>
        </m.g>
      </m.g>
      {pose === "think" && <ThinkMark y={9} offset={offset} reduce={reduce} live={live} />}
    </svg>
  );
}

function ThinkMark({ y, offset, reduce, live }: Readonly<{ y: number; offset: number; reduce: boolean | null; live: boolean }>) {
  return (
    <m.g {...(reduce ? {} : play(live, { y: [0, -3, 0], opacity: [0.85, 1, 0.85] }, loop(2, offset)))}>
      <text x={70} y={y} textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff" fontFamily="sans-serif">
        ?
      </text>
    </m.g>
  );
}


interface DuoProps {
  pose?: MascotPose;
  message?: string;
  className?: string;
  size?: "sm" | "md";
}

const SIZES = { sm: "h-11 w-11 sm:h-20 sm:w-20", md: "h-11 w-11 sm:h-32 sm:w-32" };

export function MascotDuo({ pose = "idle", message, className = "", size = "md" }: Readonly<DuoProps>) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {message && (
        <m.p
          className="mb-3 max-w-[18rem] text-center font-serif text-[15px] italic leading-snug text-current opacity-90 sm:text-[17px]"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
        >
          {message}
        </m.p>
      )}
      <div className="flex items-end -space-x-3 sm:-space-x-5" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <DesignerMascot pose={pose} joy={hovered} className={SIZES[size]} offset={0} />
        <BuilderMascot pose={pose === "wave" ? "idle" : pose} joy={hovered} className={SIZES[size]} offset={0.45} />
      </div>
    </div>
  );
}
