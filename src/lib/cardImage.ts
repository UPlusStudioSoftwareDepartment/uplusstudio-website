export const CARD_FILE = "uplus-studio-randevu-karti.jpg";

export async function imageAsJpeg(src: string) {
  const bitmap = await createImageBitmap(await (await fetch(src)).blob());
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
}

export function canShareFiles() {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "x.jpg", { type: "image/jpeg" })] });
}
