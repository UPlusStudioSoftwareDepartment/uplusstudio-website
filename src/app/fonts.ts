import { Hanken_Grotesk, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";

const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-family",
  weight: "variable",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif-family",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-family",
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
