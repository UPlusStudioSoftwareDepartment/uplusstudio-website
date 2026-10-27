
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== "string") return "";
  return String(unsafe).replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch] ?? ch);
}
