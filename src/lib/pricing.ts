export type PackageTier = "basic" | "starter" | "professional" | "business" | "enterprise" | "premium" | "cafe" | "gym";

export const packagePrices: Record<PackageTier, number> = {
  basic: 25000,
  starter: 40000,
  professional: 85000,
  business: 120000,
  enterprise: 160000,
  premium: 250000,
  cafe: 180000,
  gym: 260000,
};

export function formatTry(price: number, locale: string): string {
  return `₺${price.toLocaleString(locale === "en" ? "en-US" : "tr-TR")}`;
}

export function priceRange(locale: string): string {
  const values = Object.values(packagePrices);
  return `${formatTry(Math.min(...values), locale)} — ${formatTry(Math.max(...values), locale)}`;
}
