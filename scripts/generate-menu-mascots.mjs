// Export lightweight menu images with a facial smile loop and no body movement.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import vm from "node:vm";
import React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const source = await readFile("src/components/mascots/Mascots.tsx", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const motion = new Proxy(
  {},
  {
    get: (_, tag) =>
      function StaticMotion({
        initial,
        animate,
        transition,
        exit,
        style: originalStyle,
        ...props
      }) {
        void transition;
        void exit;
        const { originX, originY, ...style } = originalStyle ?? {};
        if (originX && originY) style.transformOrigin = `${originX} ${originY}`;
        const opacity = typeof animate?.opacity === "number" ? animate.opacity : initial?.opacity;
        if (typeof opacity === "number") style.opacity = opacity;
        if (animate?.opacity === 0) props.className = "menu-eyes";
        if (initial?.opacity === 0 && animate?.opacity === 1) props.className = "menu-smile";
        return React.createElement(tag, { ...props, style });
      },
  },
);
const exported = {};
vm.runInNewContext(compiled, {
  exports: exported,
  require: (name) => {
    if (name === "react") return React;
    if (name === "react/jsx-runtime") return jsxRuntime;
    if (name === "framer-motion")
      return {
        m: motion,
        useReducedMotion: () => true,
        useInView: () => false,
      };
    throw new Error(`Unexpected mascot dependency: ${name}`);
  },
});

const facialAnimation = `<style>
@keyframes menu-eyes{0%,20%,90%,100%{opacity:1}35%,75%{opacity:0}}
@keyframes menu-smile{0%,20%,90%,100%{opacity:0}35%,75%{opacity:1}}
.menu-eyes{animation:menu-eyes 3.8s ease-in-out var(--smile-delay,0s) infinite both}
.menu-smile{animation:menu-smile 3.8s ease-in-out var(--smile-delay,0s) infinite both}
@media(prefers-reduced-motion:reduce){.menu-eyes,.menu-smile{animation:none}}
</style>`;

await mkdir("public/media/mascots", { recursive: true });
for (const [name, Component] of [
  ["designer-menu", exported.DesignerMascot],
  ["builder-menu", exported.BuilderMascot],
]) {
  const markup = renderToStaticMarkup(
    React.createElement(Component, { pose: "idle", joy: true }),
  );
  const svg = markup
    .replace("<svg ", `<svg xmlns="http://www.w3.org/2000/svg" style="--smile-delay:${name === "builder-menu" ? "0.45s" : "0s"}" `)
    .replace(/(<svg[^>]*>)/, `$1${facialAnimation}`)
    .replace(/<g>(?=<path d="M62\.5 (?:74\.5|76) Q 70)/, '<g class="menu-smile">');
  await writeFile(`public/media/mascots/${name}.svg`, svg);
}
