export function imgUrl(url: string, width: number): string {
  return url.replace(/w=\d+/, `w=${width}`);
}
