// WebKit's native controls emit these from button.js when their own PNG icons
// fail to load in the macOS runner. They are not application JavaScript errors.
// https://github.com/WebKit/WebKit/blob/main/Source/WebCore/Modules/modern-media-controls/controls/button.js
export function isNativeWebKitMediaIconError({ browserName, message, pageUrl }: Readonly<{
  browserName: string;
  message: string;
  pageUrl: string;
}>): boolean {
  if (browserName !== "webkit") return false;
  const match = /^Button failed to load, iconName = (?:invalid-placard|pip-placard|airplay-placard), layoutTraits = \[MacOSLayoutTraits Inline\], src = blob:(\S+)$/.exec(message);
  if (!match) return false;
  try {
    const resource = new URL(match[1]);
    return resource.origin === new URL(pageUrl).origin && /^\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(resource.pathname) && !resource.search && !resource.hash;
  } catch {
    return false;
  }
}
