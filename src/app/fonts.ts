import { Hanken_Grotesk, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";

const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-family",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif-family",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-family",
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${sans.variable} ${serif.variable} ${mono.variable}`;
