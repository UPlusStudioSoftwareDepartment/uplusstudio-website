// Export the existing mascot artwork as lightweight menu images, preserving one native SVG wave.
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
        void animate;
        void transition;
        void exit;
        const { originX, originY, ...style } = originalStyle ?? {};
        if (originX && originY) style.transformOrigin = `${originX} ${originY}`;
        if (typeof initial?.opacity === "number")
          style.opacity = initial.opacity;
        if (originY === "106px" && (originX === "96px" || originX === "44px")) {
          props.className =
            originX === "96px" ? "menu-wave" : "menu-wave reverse";
        }
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

const animation = `<style>
@keyframes menu-wave{0%,100%{transform:rotate(0deg)}20%,60%{transform:rotate(-38deg)}40%,80%{transform:rotate(-12deg)}}
@keyframes menu-wave-reverse{0%,100%{transform:rotate(0deg)}20%,60%{transform:rotate(38deg)}40%,80%{transform:rotate(12deg)}}
.menu-wave{animation:menu-wave 1.6s .25s 1;transform-box:view-box}
.menu-wave.reverse{animation-name:menu-wave-reverse}
@media(prefers-reduced-motion:reduce){.menu-wave{animation:none}}
</style>`;
await mkdir("public/media/mascots", { recursive: true });
for (const [name, Component] of [
  ["designer-menu", exported.DesignerMascot],
  ["builder-menu", exported.BuilderMascot],
]) {
  const markup = renderToStaticMarkup(
    React.createElement(Component, { pose: "wave" }),
  );
  const svg = markup
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/(<svg[^>]*>)/, `$1${animation}`);
  await writeFile(`public/media/mascots/${name}.svg`, svg);
}
