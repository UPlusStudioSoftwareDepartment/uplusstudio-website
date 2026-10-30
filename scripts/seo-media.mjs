// A video can publish several responsive sources without a src on the video itself.
export function videoSources(html) {
  const readSource = (tag) => tag.match(/\ssrc=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find((value) => value !== undefined);
  const video = html.match(/<video\b[^>]*>/i)?.[0];
  const direct = video && readSource(video);
  if (direct) return [direct];
  return [...new Set([...html.matchAll(/<source\b[^>]*>/gi)].map(([tag]) => readSource(tag)).filter(Boolean))];
}
