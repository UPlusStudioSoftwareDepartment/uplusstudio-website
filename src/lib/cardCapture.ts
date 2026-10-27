export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  if (!res.ok) throw new Error("Failed to convert image");
  return res.blob();
}

export function cardCaptureOptions(node: HTMLElement) {
  return {
    pixelRatio: 3,
    backgroundColor: "#0a0a09",
    cacheBust: true,
    width: node.offsetWidth,
    height: node.offsetHeight,
    style: { margin: "0", transform: "none", boxShadow: "none" },
    filter: (el: Node) => !(el instanceof HTMLElement && el.dataset.shareHidden === "true"),
  };
}
