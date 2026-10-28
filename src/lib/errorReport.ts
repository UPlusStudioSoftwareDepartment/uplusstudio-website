export const ERROR_ENDPOINT = "/api/client-error";
const MAX_REPORTS = 5;

const sent = new Set<string>();

export function reportError(error: unknown, extra: Record<string, string | undefined> = {}) {
  if (typeof navigator === "undefined" || !navigator.sendBeacon || sent.size >= MAX_REPORTS) return;
  const err = error instanceof Error ? error : new Error(String(error));
  const key = `${err.message}|${extra.digest ?? ""}`;
  if (sent.has(key)) return;
  sent.add(key);
  const report = {
    message: err.message.slice(0, 300),
    stack: err.stack?.split("\n").slice(0, 6).join("\n").slice(0, 1200),
    page: location.pathname,
    ...extra,
  };
  navigator.sendBeacon(ERROR_ENDPOINT, new Blob([JSON.stringify(report)], { type: "application/json" }));
}
