import assert from "node:assert/strict";
import { test } from "node:test";
import { videoSources } from "./seo-media.mjs";

test("discovers both mobile and desktop video sources in server HTML", () => {
  assert.deepEqual(videoSources('<video><source src="/small.mp4" media="(max-width: 767px)" /><source src="/large.mp4" /></video>'), ["/small.mp4", "/large.mp4"]);
});

test("uses the video src when it overrides nested sources", () => {
  assert.deepEqual(videoSources("<video src='/direct.mp4'><source src='/ignored.mp4'></video>"), ["/direct.mp4"]);
});

test("ignores missing sources and removes duplicate URLs", () => {
  assert.deepEqual(videoSources('<video><source type="video/mp4"><source src=""><source src="/film.mp4"><source src="/film.mp4"></video>'), ["/film.mp4"]);
  assert.deepEqual(videoSources("<video poster='/poster.webp'></video>"), []);
});
