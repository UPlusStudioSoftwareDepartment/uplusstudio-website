// Generates the animated, schematic project drawings in public/media/diagrams/projects/.
// Each drawing only shows elements named in the project's own description (src/lib/projects.ts);
// numbers in the drawing match the legend rendered beside it on the project page.
// Run: node scripts/generate-project-diagrams.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "media", "diagrams", "projects");
mkdirSync(OUT, { recursive: true });

const C = {
  bg: "#1d1c19", ink: "#ede9e1", mute: "#a29d93", clay: "#c4825c", panel: "#2a2824", dark: "#121110",
  warm: "#f2c46b", glass: "#7fa6c9", timber: "#b07a4f", white: "#e9e4da", marble: "#d8d3cb",
  green: "#4f6b3a", grass: "#2c3324", stone: "#8a8478", water: "#3e6f8a",
};

const STYLE = `<style>
*{transform-box:fill-box;transform-origin:center}
.s1{animation:s1 5s cubic-bezier(.22,1,.36,1) infinite}.s2{animation:s2 5s cubic-bezier(.22,1,.36,1) infinite}
.s3{animation:s3 5s cubic-bezier(.22,1,.36,1) infinite}.s4{animation:s4 5s cubic-bezier(.22,1,.36,1) infinite}
.s5{animation:s5 5s cubic-bezier(.22,1,.36,1) infinite}.x2{animation:x2 5s ease infinite}
.glow{animation:glow 1.5s ease-in-out infinite}.ray{stroke-dasharray:8 8;animation:ray 0.6s linear infinite}
@keyframes s1{0%,3%{opacity:0;transform:translateY(8px)}11%,90%{opacity:1;transform:none}97%,100%{opacity:0}}
@keyframes s2{0%,19%{opacity:0;transform:translateY(8px)}27%,90%{opacity:1;transform:none}97%,100%{opacity:0}}
@keyframes s3{0%,35%{opacity:0;transform:translateY(8px)}43%,90%{opacity:1;transform:none}97%,100%{opacity:0}}
@keyframes s4{0%,51%{opacity:0;transform:translateY(8px)}59%,90%{opacity:1;transform:none}97%,100%{opacity:0}}
@keyframes s5{0%,67%{opacity:0;transform:translateY(8px)}75%,90%{opacity:1;transform:none}97%,100%{opacity:0}}
@keyframes x2{0%,19%{opacity:1}27%,100%{opacity:0}}
@keyframes glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes ray{to{stroke-dashoffset:-16}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;

const badge = (x, y, n, cls = "") =>
  `<g class="${cls}"><circle cx="${x}" cy="${y}" r="14" fill="${C.clay}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${C.dark}" font-family="ui-monospace,Menlo,monospace">${n}</text></g>`;

const svg = (title, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" width="640" height="400" role="img"><title>${title}</title>${STYLE}<rect width="640" height="400" fill="${C.bg}"/>${body}</svg>\n`;

const tree = (x, y, r = 22) => `<path d="M${x} ${y}v26" stroke="${C.stone}" stroke-width="4"/><circle cx="${x}" cy="${y - 6}" r="${r}" fill="${C.green}"/>`;

const DIAGRAMS = {
  "villa-donusumu": svg("Villa Dönüşümü: korunan yapı, yenilenen cephe", `
    <g class="s4"><rect y="330" width="640" height="70" fill="${C.grass}"/>${tree(80, 310)}${tree(565, 305, 26)}<circle cx="140" cy="330" r="12" fill="${C.green}"/><circle cx="510" cy="332" r="14" fill="${C.green}"/></g>
    <path d="M0 330h640" stroke="${C.mute}" stroke-width="2"/>
    <rect class="s3" x="160" y="130" width="320" height="200" fill="${C.white}" fill-opacity=".92"/>
    <g class="x2" opacity="0" fill="#3b4a52"><rect x="200" y="160" width="30" height="40"/><rect x="300" y="160" width="30" height="40"/><rect x="410" y="160" width="30" height="40"/><rect x="200" y="262" width="30" height="40"/><rect x="410" y="262" width="30" height="40"/></g>
    <g class="s2" fill="#3b4a52" stroke="${C.dark}" stroke-width="5"><rect x="186" y="150" width="120" height="58"/><rect x="334" y="150" width="120" height="58"/><rect x="186" y="250" width="86" height="80"/><rect x="300" y="256" width="154" height="62"/></g>
    <g class="s3" fill="${C.timber}"><rect x="290" y="238" width="176" height="10"/><rect x="460" y="130" width="20" height="200"/></g>
    <g class="s1" fill="none" stroke="${C.ink}" stroke-width="3"><rect x="160" y="130" width="320" height="200"/><path d="M160 230h320M150 130h340"/></g>
    ${badge(160, 130, 1, "s1")}${badge(306, 150, 2, "s2")}${badge(470, 120, 3, "s3")}${badge(565, 262, 4, "s4")}`),

  "evox-gym-center": svg("Evox Gym Center: alanlar ve ışık dili", `
    <rect x="60" y="60" width="520" height="280" fill="none" stroke="${C.ink}" stroke-width="4"/>
    <g class="s1"><rect x="70" y="70" width="280" height="170" fill="${C.panel}"/><path d="M130 160h160" stroke="${C.mute}" stroke-width="5"/><rect x="118" y="142" width="12" height="36" fill="${C.mute}"/><rect x="290" y="142" width="12" height="36" fill="${C.mute}"/></g>
    <g class="s2"><rect x="360" y="70" width="210" height="110" fill="${C.panel}"/><rect x="415" y="90" width="100" height="70" fill="none" stroke="${C.clay}" stroke-width="3"/></g>
    <g class="s3"><rect x="360" y="190" width="210" height="140" fill="${C.panel}"/><rect x="390" y="230" width="60" height="22" rx="3" fill="${C.mute}" fill-opacity=".6"/><rect x="480" y="230" width="60" height="22" rx="3" fill="${C.mute}" fill-opacity=".6"/><rect x="390" y="275" width="60" height="22" rx="3" fill="${C.mute}" fill-opacity=".6"/><rect x="480" y="275" width="60" height="22" rx="3" fill="${C.mute}" fill-opacity=".6"/></g>
    <g class="s4"><rect x="70" y="250" width="130" height="80" fill="${C.panel}"/><path d="M90 262v56M110 262v56M130 262v56M150 262v56M170 262v56" stroke="${C.mute}" stroke-width="3"/></g>
    <g class="s5"><rect x="210" y="250" width="140" height="80" fill="${C.panel}"/><path d="M232 312v-26h96v26M232 298h96" fill="none" stroke="${C.timber}" stroke-width="6" stroke-linejoin="round"/></g>
    <g class="glow" stroke="${C.warm}" stroke-width="3" stroke-linecap="round"><path d="M90 88h240M90 222h240M380 82h170M380 318h170"/></g>
    ${badge(70, 70, 1, "s1")}${badge(360, 70, 2, "s2")}${badge(360, 190, 3, "s3")}${badge(70, 250, 4, "s4")}${badge(210, 250, 5, "s5")}`),

  "butik-kafe": svg("Kedili Butik Kafe: malzeme paleti ve marka", `
    <g class="s1"><rect x="60" y="56" width="110" height="150" rx="4" fill="#b98b5e"/><path d="M60 90h110M60 130h110M60 170h110" stroke="#9c7149" stroke-width="2"/></g>
    <rect class="s2" x="190" y="56" width="110" height="150" rx="4" fill="#d9c7a7"/>
    <rect class="s3" x="320" y="56" width="110" height="150" rx="4" fill="#2c3e5c"/>
    <g class="s4"><rect x="450" y="56" width="110" height="150" rx="4" fill="#b8954f"/><path d="M450 76h110M450 92h110M450 108h110M450 124h110M450 140h110M450 156h110M450 172h110M450 188h110" stroke="#cfae6c" stroke-width="1.5" opacity=".7"/></g>
    <g class="s5">
      <g fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"><circle cx="220" cy="306" r="44"/><path d="M186 276l-6-40 30 22M254 276l6-40-30 22M206 326q14 10 28 0M220 312v8"/></g>
      <circle cx="203" cy="300" r="7" fill="#5ba3d9"/><circle cx="237" cy="300" r="7" fill="#e3b04b"/>
      <path d="M300 306h40" stroke="${C.mute}" stroke-width="2" stroke-dasharray="6 6"/>
      <g fill="none" stroke="${C.ink}" stroke-width="3"><path d="M380 270h80l-8 80h-64z"/><path d="M460 290h12a14 14 0 0 1 0 28h-16"/></g>
      <circle cx="420" cy="308" r="14" fill="none" stroke="${C.clay}" stroke-width="3"/>
    </g>
    ${badge(60, 56, 1, "s1")}${badge(190, 56, 2, "s2")}${badge(320, 56, 3, "s3")}${badge(450, 56, 4, "s4")}${badge(176, 262, 5, "s5")}`),

  "modern-villa": svg("Modern Villa: iki kütle, cam yüzeyler ve havuz terası", `
    ${tree(56, 270, 28)}${tree(590, 262, 30)}
    <path d="M0 300h640" stroke="${C.mute}" stroke-width="2"/>
    <g class="s1" fill="${C.white}" fill-opacity=".9" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"><path d="M120 300V180l90-58 90 58v120z"/><path d="M320 300V160l90-66 90 66v140z"/></g>
    <g class="s2" fill="#2f3d47" stroke="${C.dark}" stroke-width="4"><rect x="140" y="210" width="140" height="80"/><rect x="340" y="190" width="140" height="100"/><rect x="390" y="128" width="40" height="40"/></g>
    <g class="s4"><rect class="glow" x="144" y="214" width="132" height="72" fill="${C.warm}" fill-opacity=".55"/><rect class="glow" x="344" y="194" width="132" height="92" fill="${C.warm}" fill-opacity=".55"/></g>
    <g class="s3"><rect x="90" y="300" width="440" height="12" fill="${C.stone}"/><rect x="150" y="312" width="320" height="34" fill="${C.water}"/><path d="M175 328h40M260 322h50M360 332h60" stroke="#9fc4d8" stroke-width="2" opacity=".8"/></g>
    ${badge(300, 104, 1, "s1")}${badge(280, 206, 2, "s2")}${badge(480, 330, 3, "s3")}${badge(486, 186, 4, "s4")}`),

  "ofis-yenileme": svg("Villadan ofise: gün ışığı, cam bölme ve depolama", `
    <path d="M30 90h560M30 320h560" stroke="${C.mute}" stroke-width="3"/>
    <path d="M80 90v40M80 290v30M560 90v230" stroke="${C.ink}" stroke-width="5"/>
    <g class="s5"><rect x="80" y="320" width="480" height="12" fill="#bdb8ae"/><path class="glow" d="M150 98h360" stroke="${C.warm}" stroke-width="4" stroke-linecap="round"/></g>
    <g class="s2"><path class="ray" d="M90 150L330 318M90 200L380 318M90 250L420 318" stroke="${C.warm}" stroke-width="2.5"/><ellipse cx="360" cy="316" rx="90" ry="8" fill="${C.warm}" fill-opacity=".35"/></g>
    <g class="s1"><rect x="72" y="130" width="16" height="160" fill="${C.glass}"/><path d="M72 130h16v160H72zM72 210h16" fill="none" stroke="${C.dark}" stroke-width="3"/><path d="M28 230h44M28 230v60M44 230v60M58 230v60" stroke="${C.mute}" stroke-width="2"/></g>
    <g class="s3"><rect x="430" y="118" width="10" height="202" fill="${C.glass}" fill-opacity=".45"/><path d="M430 118h10v202h-10zM430 220h10" fill="none" stroke="${C.dark}" stroke-width="3"/></g>
    <g class="s4"><rect x="490" y="110" width="66" height="210" fill="${C.panel}" stroke="${C.ink}" stroke-width="2"/><path d="M512 110v210M534 110v210" stroke="${C.mute}" stroke-width="2"/></g>
    <rect class="x2" opacity="0" x="80" y="90" width="480" height="230" fill="#0b0a09" fill-opacity=".8"/>
    ${badge(80, 118, 1, "s1")}${badge(250, 250, 2, "s2")}${badge(435, 106, 3, "s3")}${badge(523, 98, 4, "s4")}${badge(150, 344, 5, "s5")}`),

  "konut-uygulama": svg("Konut uygulaması: giriş holü ve merdiven detayları", `
    <path d="M40 330h560M40 60h560" stroke="${C.mute}" stroke-width="3"/>
    <g class="s1"><rect x="60" y="80" width="170" height="250" fill="${C.white}" fill-opacity=".9"/><rect x="92" y="128" width="72" height="202" fill="none" stroke="#b9b3a8" stroke-width="1.5"/><rect x="150" y="226" width="4" height="22" fill="${C.dark}"/></g>
    <g class="s2"><path d="M250 330v-30h40v-30h40v-30h40v-30h40v-30h40v-30h30" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/><path d="M262 300L470 120v-60L262 240z" fill="${C.glass}" fill-opacity=".22" stroke="${C.glass}" stroke-width="2"/></g>
    <g class="s3"><rect x="490" y="80" width="110" height="250" fill="${C.timber}"/><path d="M512 80v250M534 80v250M556 80v250M578 80v250" stroke="#8f603c" stroke-width="2"/></g>
    <path class="s4 glow" d="M60 70h540" stroke="${C.warm}" stroke-width="5" stroke-linecap="round"/>
    ${badge(92, 128, 1, "s1")}${badge(470, 140, 2, "s2")}${badge(490, 96, 3, "s3")}${badge(330, 70, 4, "s4")}`),

  "konut-ic-mekan": svg("Konut iç mekân: salon, yemek alanı ve yatak odası", `
    <rect x="60" y="60" width="520" height="280" fill="none" stroke="${C.ink}" stroke-width="5"/>
    <path d="M340 60v280M340 195h240" stroke="${C.mute}" stroke-width="4"/>
    <g class="s1"><rect x="90" y="250" width="200" height="50" rx="10" fill="#6b5a4a"/><rect x="72" y="90" width="14" height="140" fill="${C.marble}"/></g>
    <g class="s2" fill="#6b5a4a"><rect x="400" y="100" width="120" height="50" rx="4"/><circle cx="420" cy="88" r="9"/><circle cx="460" cy="88" r="9"/><circle cx="500" cy="88" r="9"/><circle cx="420" cy="162" r="9"/><circle cx="460" cy="162" r="9"/><circle cx="500" cy="162" r="9"/></g>
    <g class="s3"><rect x="410" y="225" width="110" height="90" rx="6" fill="#6b5a4a"/><rect x="420" y="232" width="40" height="22" rx="4" fill="${C.white}" fill-opacity=".7"/><rect x="470" y="232" width="40" height="22" rx="4" fill="${C.white}" fill-opacity=".7"/></g>
    <g class="s4 glow" stroke="${C.warm}" stroke-width="3" stroke-linecap="round"><path d="M74 72h254M352 72h216M352 208h216"/></g>
    <g class="s5"><rect x="86" y="90" width="20" height="140" fill="${C.timber}"/><path d="M74 120l10 30M76 180l8 20" stroke="#a9a39a" stroke-width="1.5"/></g>
    ${badge(190, 236, 1, "s1")}${badge(400, 100, 2, "s2")}${badge(410, 225, 3, "s3")}${badge(200, 72, 4, "s4")}${badge(106, 250, 5, "s5")}`),

  "tek-katli-ev": svg("Tek katlı modern ev: tek seviyede yaşam ve bahçe", `
    <rect y="300" width="640" height="100" fill="${C.grass}"/>${tree(60, 282, 26)}${tree(590, 276, 28)}
    <path d="M0 300h640" stroke="${C.mute}" stroke-width="2"/>
    <rect class="s1" x="120" y="200" width="400" height="100" fill="${C.white}" fill-opacity=".92" stroke="${C.ink}" stroke-width="3"/>
    <path class="s2" d="M100 202l80-62h280l80 62z" fill="#3a3833" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>
    <g class="s3" fill="#2f3d47" stroke="${C.dark}" stroke-width="4"><rect x="300" y="216" width="90" height="76"/><rect x="400" y="216" width="100" height="76"/></g>
    <rect class="s4" x="160" y="214" width="76" height="86" fill="${C.timber}"/>
    <g class="s5" fill="${C.stone}"><rect x="182" y="310" width="34" height="12" rx="3"/><rect x="172" y="330" width="34" height="12" rx="3"/><rect x="186" y="350" width="34" height="12" rx="3"/><rect x="176" y="370" width="34" height="12" rx="3"/></g>
    ${badge(120, 200, 1, "s1")}${badge(320, 140, 2, "s2")}${badge(500, 216, 3, "s3")}${badge(160, 214, 4, "s4")}${badge(232, 344, 5, "s5")}`),

  "konut-projeleri": svg("Konut projeleri: balkonlar, gün ışığı ve ortak alanlar", `
    <path d="M0 320h640" stroke="${C.mute}" stroke-width="2"/>
    <g class="s1" fill="${C.panel}" stroke="${C.ink}" stroke-width="3"><rect x="90" y="80" width="160" height="240"/><rect x="330" y="120" width="160" height="200"/></g>
    <g class="s1" stroke="${C.mute}" stroke-width="1.5"><path d="M90 128h160M90 176h160M90 224h160M90 272h160M330 160h160M330 200h160M330 240h160M330 280h160"/></g>
    <g class="s2" fill="${C.timber}"><rect x="250" y="116" width="26" height="8"/><rect x="250" y="164" width="26" height="8"/><rect x="250" y="212" width="26" height="8"/><rect x="250" y="260" width="26" height="8"/><rect x="490" y="152" width="26" height="8"/><rect x="490" y="192" width="26" height="8"/><rect x="490" y="232" width="26" height="8"/><rect x="490" y="272" width="26" height="8"/></g>
    <g class="s3"><circle cx="596" cy="52" r="18" fill="${C.warm}"/><path class="ray" d="M580 62L276 120M580 66L276 216M582 70L516 160M584 74L516 260" stroke="${C.warm}" stroke-width="2"/></g>
    <g class="s4"><rect y="320" width="640" height="80" fill="${C.grass}"/>${tree(56, 352, 18)}${tree(300, 356, 18)}${tree(560, 352, 18)}<path d="M20 384h600" stroke="${C.stone}" stroke-width="3" stroke-dasharray="10 8"/></g>
    ${badge(90, 80, 1, "s1")}${badge(276, 104, 2, "s2")}${badge(540, 52, 3, "s3")}${badge(150, 376, 4, "s4")}`),

  "villa-ic-mekan": svg("Villa iç mekânı: taş şömine, mermer ada ve büyük pencereler", `
    <path d="M30 70h580M30 330h580" stroke="${C.mute}" stroke-width="3"/>
    <g class="s1"><rect x="60" y="90" width="150" height="240" fill="#5a554d"/><g fill="${C.stone}"><rect x="66" y="96" width="44" height="22"/><rect x="114" y="96" width="44" height="22"/><rect x="162" y="96" width="42" height="22"/><rect x="66" y="122" width="62" height="22"/><rect x="132" y="122" width="72" height="22"/><rect x="66" y="148" width="40" height="22"/><rect x="110" y="148" width="50" height="22"/><rect x="164" y="148" width="40" height="22"/></g><rect x="90" y="240" width="90" height="70" fill="${C.dark}"/><ellipse class="glow" cx="135" cy="296" rx="30" ry="12" fill="${C.warm}" fill-opacity=".7"/></g>
    <g class="s2"><rect x="270" y="250" width="180" height="80" fill="${C.marble}"/><path d="M290 262l40 30M360 258l30 50M410 270l20 20" stroke="#a9a39a" stroke-width="1.5"/></g>
    <g class="s3"><rect x="490" y="80" width="110" height="250" fill="#2f3d47"/><path d="M490 80h110v250H490zM545 80v250" fill="none" stroke="${C.dark}" stroke-width="4"/><path class="ray" d="M490 120L380 330M490 200L330 330" stroke="${C.warm}" stroke-width="2"/></g>
    <g class="s4"><rect x="30" y="330" width="580" height="12" fill="${C.timber}"/><rect x="230" y="336" width="200" height="6" rx="3" fill="#d9c7a7"/></g>
    ${badge(60, 90, 1, "s1")}${badge(450, 250, 2, "s2")}${badge(490, 80, 3, "s3")}${badge(300, 360, 4, "s4")}`),

  pastane: svg("Pastane konsepti: cam cephe, ışıklı vitrin ve kasa bankosu", `
    <path d="M30 70h580M30 330h580" stroke="${C.mute}" stroke-width="3"/>
    <g class="s1"><rect x="40" y="80" width="22" height="250" fill="${C.glass}" fill-opacity=".6"/><path d="M40 80h22v250H40zM40 200h22" fill="none" stroke="${C.dark}" stroke-width="3"/></g>
    <g class="s2"><rect x="180" y="230" width="220" height="100" fill="${C.timber}"/><rect x="180" y="186" width="220" height="44" fill="${C.glass}" fill-opacity=".3" stroke="${C.glass}" stroke-width="2"/><g class="glow" fill="${C.warm}"><circle cx="215" cy="214" r="9"/><circle cx="255" cy="214" r="9"/><circle cx="295" cy="214" r="9"/><circle cx="335" cy="214" r="9"/><circle cx="370" cy="214" r="9"/></g></g>
    <g class="s3"><rect x="450" y="250" width="130" height="80" fill="${C.marble}"/><path d="M466 262l30 26M530 258l30 46" stroke="#a9a39a" stroke-width="1.5"/></g>
    <g class="s4"><path d="M140 84h460" stroke="${C.ink}" stroke-width="4"/><g fill="${C.ink}"><rect x="226" y="84" width="14" height="18"/><rect x="326" y="84" width="14" height="18"/><rect x="506" y="84" width="14" height="18"/></g><g class="glow" fill="${C.warm}" fill-opacity=".16"><path d="M226 102h14l40 84h-94z"/><path d="M326 102h14l40 84h-94z"/><path d="M506 102h14l50 148h-114z"/></g></g>
    ${badge(62, 80, 1, "s1")}${badge(180, 186, 2, "s2")}${badge(580, 250, 3, "s3")}${badge(140, 84, 4, "s4")}`),

  "yonetici-ofisi": svg("Yönetici odası: koyu duvarlar, masif masa ve görüşme koltukları", `
    <rect x="80" y="50" width="480" height="300" fill="none" stroke="${C.mute}" stroke-width="2"/>
    <rect class="s1" x="80" y="50" width="480" height="300" fill="#2a2320" stroke="#5a4636" stroke-width="12"/>
    <g class="s2"><rect x="250" y="96" width="140" height="62" rx="3" fill="#6b4a32"/><circle cx="320" cy="78" r="14" fill="#3a2a22"/></g>
    <g class="s3" fill="#6b3b2a"><rect x="196" y="214" width="76" height="66" rx="16"/><rect x="368" y="214" width="76" height="66" rx="16"/><g fill="#8a5a44"><circle cx="216" cy="236" r="2.5"/><circle cx="234" cy="236" r="2.5"/><circle cx="252" cy="236" r="2.5"/><circle cx="388" cy="236" r="2.5"/><circle cx="406" cy="236" r="2.5"/><circle cx="424" cy="236" r="2.5"/></g><circle cx="320" cy="248" r="22" fill="#4a3428"/></g>
    <g class="s4 glow" fill="${C.warm}" fill-opacity=".22"><circle cx="320" cy="126" r="70"/><circle cx="120" cy="90" r="40"/><circle cx="520" cy="90" r="40"/><circle cx="120" cy="310" r="40"/><circle cx="520" cy="310" r="40"/></g>
    ${badge(80, 50, 1, "s1")}${badge(390, 96, 2, "s2")}${badge(444, 214, 3, "s3")}${badge(520, 130, 4, "s4")}`),
};

for (const [slug, content] of Object.entries(DIAGRAMS)) {
  writeFileSync(join(OUT, `${slug}.svg`), content);
}
console.log(`wrote ${Object.keys(DIAGRAMS).length} diagrams to ${OUT}`);

// Service diagrams. Zoning follows common practice: public → semi-private → private for offices,
// front of house / back of house for cafés (customer WC reached from the guest area, never through
// the kitchen or store; store beside the kitchen with its own service entrance).
const wall = (d) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="square"/>`;
const arrowTo = (x, y, rot, color) => `<path d="M0 0l-10-5v10z" transform="translate(${x} ${y}) rotate(${rot})" fill="${color}"/>`;

const SERVICE = {
  "office-zones": svg("Ofis bölgeleme şeması: karşılama, toplantı, açık çalışma, odak odaları ve destek alanları", `
    <rect x="40" y="70" width="560" height="260" fill="#211f1c"/>
    <g class="s3" stroke="${C.glass}" stroke-width="6"><path d="M200 330h120M350 330h110M490 330h100M600 200v110"/></g>
    <g class="s1"><rect x="118" y="230" width="54" height="20" rx="3" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"/><g fill="${C.mute}"><circle cx="62" cy="310" r="7"/><circle cx="82" cy="310" r="7"/></g></g>
    <g class="s2"><rect x="74" y="104" width="76" height="40" rx="3" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"/><g fill="${C.mute}"><circle cx="90" cy="96" r="5"/><circle cx="134" cy="96" r="5"/><circle cx="90" cy="152" r="5"/><circle cx="134" cy="152" r="5"/></g></g>
    <g class="s4" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"><rect x="214" y="92" width="26" height="18"/><rect x="264" y="92" width="26" height="18"/><rect x="314" y="92" width="26" height="18"/><rect x="380" y="96" width="60" height="24"/><circle cx="410" cy="138" r="7" fill="${C.mute}" stroke="none"/></g>
    <g class="s5" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"><rect x="482" y="88" width="56" height="14"/><rect x="482" y="112" width="24" height="24"/><rect x="566" y="96" width="20" height="26" rx="6"/></g>
    <g class="s3" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"><rect x="214" y="232" width="78" height="22" rx="2"/><rect x="214" y="290" width="78" height="22" rx="2"/><rect x="330" y="232" width="78" height="22" rx="2"/><rect x="330" y="290" width="78" height="22" rx="2"/><rect x="446" y="232" width="78" height="22" rx="2"/><rect x="446" y="290" width="78" height="22" rx="2"/></g>
    ${wall("M40 70h560v130M600 310v20H40v-44M40 254V70")}
    ${wall("M40 170h60M140 170h40v16M180 210v120")}
    ${wall("M180 70v100M180 170h12M222 170h28M272 170h28M322 170h18M370 170h16M416 170h44M490 170h40M560 170h40")}
    ${wall("M250 70v100M300 70v100M340 70v100M460 70v100M550 70v100")}
    <path d="M200 210h400" stroke="${C.mute}" stroke-width="1.5" stroke-dasharray="4 6"/>
    <path d="M14 270h18" stroke="${C.clay}" stroke-width="3"/>${arrowTo(40, 270, 0, C.clay)}
    <path class="ray" d="M44 270h60V172v-40" stroke="${C.clay}" stroke-width="2.5" fill="none"/>
    <path class="ray" d="M110 270h46l18-80h120v40" stroke="${C.mute}" stroke-width="2" fill="none"/>
    ${badge(150, 300, 1, "s1")}${badge(56, 86, 2, "s2")}${badge(560, 272, 3, "s3")}${badge(380, 140, 4, "s4")}${badge(520, 152, 5, "s5")}`),

  "cafe-flow": svg("Kafe akış şeması: giriş ve sipariş, salon, bar, mutfak, müşteri WC ve depo", `
    <rect x="40" y="70" width="560" height="260" fill="#211f1c"/>
    <g class="s2" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"><circle cx="110" cy="120" r="16"/><circle cx="200" cy="120" r="16"/><circle cx="290" cy="120" r="16"/><circle cx="200" cy="200" r="16"/><circle cx="290" cy="200" r="16"/><rect x="230" y="258" width="80" height="22" rx="3"/></g>
    <g class="s3"><rect x="380" y="100" width="26" height="150" fill="${C.timber}"/><path d="M372 100v150" stroke="${C.ink}" stroke-width="2"/></g>
    <g class="s4" stroke="${C.mute}" stroke-width="1" opacity=".8"><path d="M460 90v100M480 90v100M500 90v100M520 90v100M540 90v100M560 90v100M580 90v100"/></g>
    <g class="s5"><rect x="460" y="246" width="30" height="40" rx="10" fill="${C.panel}" stroke="${C.ink}" stroke-width="1.5"/><path d="M536 236h50M536 256h50M536 276h50" stroke="${C.mute}" stroke-width="5"/></g>
    ${wall("M40 70h560v160M600 270v60H150M110 330H40V70")}
    ${wall("M440 70v60M440 170v40h110M575 210h25M440 230v100M440 230h28M500 230h20M520 210v120")}
    
    <path d="M440 132v18" stroke="${C.warm}" stroke-width="4"/>
    <path d="M130 352v-18" stroke="${C.clay}" stroke-width="3"/>${arrowTo(130, 330, -90, C.clay)}
    <path class="ray" d="M130 324v-20h230v-84" stroke="${C.clay}" stroke-width="2.5" fill="none"/>
    <path class="ray" d="M360 264h52v-44h40v14" stroke="${C.clay}" stroke-width="2" fill="none"/>
    <path class="ray" d="M622 250h-20M562 240v-40M420 160h40" stroke="${C.mute}" stroke-width="2" fill="none"/>
    ${badge(130, 300, 1, "s1")}${badge(110, 160, 2, "s2")}${badge(393, 86, 3, "s3")}${badge(520, 130, 4, "s4")}${badge(470, 306, 5, "s5")}${badge(568, 306, 6, "s5")}`),
};

const SERVICE_OUT = join(process.cwd(), "public", "media", "diagrams");
for (const [name, content] of Object.entries(SERVICE)) writeFileSync(join(SERVICE_OUT, `${name}.svg`), content);
console.log(`wrote ${Object.keys(SERVICE).length} service diagrams`);

// Guide diagrams. Numbers only, no words, so one file serves both languages; the legend on the
// guide page (src/lib/guides*.ts) carries the meaning. Schematic, never to scale.
const person = (x, y) => `<circle cx="${x}" cy="${y}" r="8"/><path d="M${x - 11} ${y + 30}a11 13 0 0 1 22 0z"/>`;
const GUIDES = {
  "ticari-mekan-kiralama": svg("Kiralamadan önce dükkânda bakılacak noktalar", `
    <path d="M0 330h640" stroke="${C.mute}" stroke-width="2"/>
    <g class="s1"><rect x="90" y="60" width="440" height="110" fill="${C.panel}" stroke="${C.ink}" stroke-width="3"/><g fill="#2f3d47"><rect x="120" y="85" width="60" height="50"/><rect x="220" y="85" width="60" height="50"/><rect x="320" y="85" width="60" height="50"/><rect x="420" y="85" width="60" height="50"/></g></g>
    <rect x="90" y="170" width="440" height="160" fill="#211f1c" stroke="${C.ink}" stroke-width="3"/>
    <g class="s5"><rect x="110" y="212" width="250" height="110" fill="${C.glass}" fill-opacity=".22" stroke="${C.glass}" stroke-width="2"/><rect x="380" y="226" width="56" height="104" fill="${C.panel}" stroke="${C.ink}" stroke-width="2"/><path d="M366 330h84l22 14H344z" fill="${C.stone}"/></g>
    <g class="s5"><rect x="100" y="178" width="420" height="22" fill="${C.clay}" fill-opacity=".25" stroke="${C.clay}" stroke-width="2"/><path d="M130 189h120M270 189h60" stroke="${C.ink}" stroke-width="3"/></g>
    <g class="s2"><rect x="456" y="226" width="40" height="52" rx="3" fill="${C.panel}" stroke="${C.ink}" stroke-width="2"/><path d="M480 234l-10 16h10l-8 18" fill="none" stroke="${C.warm}" stroke-width="3" stroke-linejoin="round"/><path class="ray" d="M476 226v-26" stroke="${C.warm}" stroke-width="2"/></g>
    <g class="s3"><path d="M514 206v124" stroke="${C.water}" stroke-width="5"/><path class="ray" d="M514 340v24H300" stroke="${C.water}" stroke-width="3" fill="none"/></g>
    <g class="s4"><rect x="542" y="40" width="18" height="246" fill="${C.stone}"/><path d="M534 40h34" stroke="${C.ink}" stroke-width="4"/><path d="M530 274h12" stroke="${C.stone}" stroke-width="8"/><path class="ray" d="M551 32V8" stroke="${C.mute}" stroke-width="2"/></g>
    ${badge(90, 60, 1, "s1")}${badge(496, 226, 2, "s2")}${badge(514, 300, 3, "s3")}${badge(570, 64, 4, "s4")}${badge(436, 226, 5, "s5")}${badge(100, 189, 6, "s5")}`),

  "banyo-katmanlari": svg("Banyo kesiti: tesisat, su yalıtımı, eğimli şap, kaplama, armatür ve havalandırma", `
    <rect x="60" y="50" width="26" height="270" fill="${C.stone}"/>
    <rect x="60" y="320" width="540" height="44" fill="#4a463f"/>
    <g class="s1"><path d="M140 334L470 348" stroke="${C.water}" stroke-width="6"/><path d="M470 306v76" stroke="${C.water}" stroke-width="6"/></g>
    <g class="s2"><path d="M88 228V317h512" fill="none" stroke="#5ba3d9" stroke-width="4"/></g>
    <g class="s3"><path d="M88 317h512v-22L470 305L88 291z" fill="${C.stone}"/></g>
    <g class="s4"><path d="M88 288L470 302L600 292" fill="none" stroke="${C.marble}" stroke-width="6" stroke-dasharray="26 3"/><path d="M92 58v226" stroke="${C.marble}" stroke-width="6" stroke-dasharray="26 3"/></g>
    <g class="s5"><path d="M96 110h70v18" fill="none" stroke="${C.ink}" stroke-width="4"/><rect x="152" y="128" width="30" height="8" rx="2" fill="${C.ink}"/><path class="ray" d="M158 144v84M168 144v92M178 144v84" stroke="${C.glass}" stroke-width="2"/><rect x="455" y="297" width="30" height="8" fill="${C.dark}" stroke="${C.ink}" stroke-width="1.5"/></g>
    <g class="s5"><circle cx="540" cy="96" r="26" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M540 96l14-14M540 96l-14 14M540 96l14 14M540 96l-14-14" stroke="${C.mute}" stroke-width="3"/><path class="ray" d="M570 96h50M566 80l40-20" stroke="${C.mute}" stroke-width="2"/></g>
    ${badge(300, 350, 1, "s1")}${badge(88, 228, 2, "s2")}${badge(600, 300, 3, "s3")}${badge(92, 58, 4, "s4")}${badge(182, 128, 5, "s5")}${badge(540, 60, 6, "s5")}`),

  "mimar-muhendis-rolleri": svg("Bir yapıda kim neyi çizer: mimar, iç mimar, inşaat, makine ve elektrik mühendisleri, harita ve zemin", `
    <rect y="320" width="640" height="80" fill="#2a2824"/><path d="M0 350h640M0 376h640" stroke="${C.stone}" stroke-width="1.5" stroke-dasharray="12 8"/>
    <g class="s1"><path d="M160 320V170L320 90l160 80v150z" fill="${C.white}" fill-opacity=".08" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></g>
    <g class="s3"><path d="M174 320V172M320 320V98M466 320V172M160 246h320" stroke="${C.stone}" stroke-width="8"/><rect x="150" y="320" width="340" height="14" fill="${C.stone}"/></g>
    <g class="s2"><rect x="190" y="288" width="84" height="24" rx="6" fill="#6b5a4a"/><rect x="198" y="312" width="68" height="5" fill="#d9c7a7"/><rect x="350" y="218" width="84" height="20" rx="4" fill="#6b5a4a"/></g>
    <g class="s4"><path d="M446 360V292h-58" fill="none" stroke="${C.water}" stroke-width="4"/><rect x="352" y="272" width="34" height="36" fill="none" stroke="${C.water}" stroke-width="3"/><path d="M362 276v28M370 276v28M378 276v28" stroke="${C.water}" stroke-width="2"/></g>
    <g class="s5"><path d="M200 176v18h56v6" fill="none" stroke="${C.warm}" stroke-width="2.5"/><circle class="glow" cx="256" cy="210" r="10" fill="${C.warm}"/></g>
    <g class="s5"><path d="M90 320v-50" stroke="${C.ink}" stroke-width="3"/><path d="M90 270l26 8-26 8z" fill="${C.clay}"/><path d="M90 326h60" stroke="${C.clay}" stroke-width="2" stroke-dasharray="5 5"/><path d="M112 330v62" stroke="${C.ink}" stroke-width="3" stroke-dasharray="4 4"/></g>
    ${badge(320, 74, 1, "s1")}${badge(190, 288, 2, "s2")}${badge(466, 172, 3, "s3")}${badge(386, 272, 4, "s4")}${badge(276, 200, 5, "s5")}${badge(130, 270, 6, "s5")}`),

  "alici-profili": svg("Alıcıya göre konut projesi: hedef alıcı, daire tipleri, gün ışığı, ıslak hacimler ve satış sunumu", `
    <g class="s1" fill="${C.mute}">${person(140, 54)}${person(300, 54)}${person(326, 54)}${person(470, 54)}${person(496, 54)}${person(522, 58)}${person(546, 58)}</g>
    <g class="s2" fill="${C.panel}" stroke="${C.ink}" stroke-width="3"><rect x="80" y="120" width="120" height="170"/><rect x="240" y="120" width="150" height="170"/><rect x="430" y="120" width="170" height="170"/></g>
    <g class="s2" stroke="${C.mute}" stroke-width="2"><path d="M80 200h120M140 120v80M240 200h150M315 120v80M315 200v90M430 200h170M490 120v80M545 120v80M515 200v90"/></g>
    <g class="s4"><path d="M60 143h560" stroke="${C.water}" stroke-width="1.5" stroke-dasharray="4 6"/><g fill="${C.water}"><rect x="166" y="128" width="28" height="30"/><rect x="354" y="128" width="30" height="30"/><rect x="562" y="128" width="32" height="30"/></g></g>
    <g class="s3"><circle cx="40" cy="342" r="16" fill="${C.warm}"/><path class="ray" d="M56 334L120 292M58 338L300 292M60 344L520 292" stroke="${C.warm}" stroke-width="2"/><g fill="${C.glass}"><rect x="100" y="286" width="60" height="6"/><rect x="260" y="286" width="90" height="6"/><rect x="450" y="286" width="120" height="6"/></g></g>
    <g class="s5"><rect x="250" y="314" width="140" height="70" fill="#211f1c" stroke="${C.ink}" stroke-width="2"/><path d="M276 370v-26l26-18 26 18v26z" fill="${C.white}" fill-opacity=".85"/><rect x="292" y="350" width="20" height="20" fill="#2f3d47"/><path d="M340 370l14-20 14 20z" fill="${C.green}"/></g>
    ${badge(110, 64, 1, "s1")}${badge(80, 120, 2, "s2")}${badge(70, 362, 3, "s3")}${badge(606, 128, 4, "s4")}${badge(390, 314, 5, "s5")}`),

  "villa-yenileme": svg("Mevcut villayı yenilerken ele alınan başlıklar: çatı, cephe, iç yerleşim, tesisat, teras ve site kuralları", `
    <rect y="320" width="640" height="80" fill="${C.grass}"/>${tree(612, 300, 22)}
    <path d="M0 320h640" stroke="${C.mute}" stroke-width="2"/>
    <g class="s1"><path d="M150 172l170-82 170 82z" fill="#3a3833" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M196 166h248" stroke="${C.warm}" stroke-width="6" stroke-dasharray="6 4"/></g>
    <rect x="170" y="172" width="300" height="148" fill="${C.white}" fill-opacity=".9" stroke="${C.ink}" stroke-width="3"/>
    <g class="s2" fill="#2f3d47" stroke="${C.dark}" stroke-width="4"><rect x="195" y="192" width="70" height="46"/><rect x="375" y="192" width="70" height="46"/><rect x="290" y="252" width="60" height="68"/></g>
    <g class="s3"><path d="M320 176v70M176 246h288" stroke="${C.clay}" stroke-width="2.5" stroke-dasharray="7 6"/></g>
    <g class="s4"><rect x="410" y="266" width="32" height="40" fill="none" stroke="${C.water}" stroke-width="3"/><path d="M420 270v32M432 270v32" stroke="${C.water}" stroke-width="2"/><path d="M442 296h16v52" fill="none" stroke="${C.water}" stroke-width="4"/></g>
    <g class="s5"><rect x="470" y="300" width="124" height="20" fill="${C.timber}"/><path d="M482 300v-66h100v66M478 234h108" fill="none" stroke="${C.timber}" stroke-width="4"/></g>
    <g class="s5"><path d="M24 320v-34M46 320v-34M68 320v-34M90 320v-34M112 320v-34M18 298h100" stroke="${C.stone}" stroke-width="3"/></g>
    ${badge(320, 112, 1, "s1")}${badge(195, 192, 2, "s2")}${badge(320, 246, 3, "s3")}${badge(442, 266, 4, "s4")}${badge(582, 234, 5, "s5")}${badge(68, 276, 6, "s5")}`),
};

const GUIDE_OUT = join(process.cwd(), "public", "media", "diagrams", "guides");
mkdirSync(GUIDE_OUT, { recursive: true });
// Guide drawings stay still: several sit on one page as card images, and endless image animations
// kept the main thread busy on mid-range phones (Lighthouse TBT). The numbers carry the sequence.
const still = (content) => content.replace(/<style>[\s\S]*?<\/style>/, "");
for (const [name, content] of Object.entries(GUIDES)) writeFileSync(join(GUIDE_OUT, `${name}.svg`), still(content));
console.log(`wrote ${Object.keys(GUIDES).length} guide diagrams`);
