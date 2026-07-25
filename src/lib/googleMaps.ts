// Loads the Google Maps JavaScript API exactly once and caches the promise
// so every map component in the app shares the same script load.
//
// Two failure modes are handled explicitly, because Google does NOT reject
// the script's load event when the key/project is misconfigured — it loads
// the script fine and then draws its own "Oops! Something went wrong" panel
// on top of any map you create. The only way to catch that programmatically
// is the `window.gm_authFailure` callback below.

let loadPromise: Promise<any> | null = null;

export class GoogleMapsAuthError extends Error {
  constructor() {
    super(
      "Google Maps rejected this API key (billing not enabled, Maps JavaScript API not enabled, or the key's referrer restrictions don't allow this origin).",
    );
    this.name = "GoogleMapsAuthError";
  }
}

export async function loadGoogleMaps(apiKey?: string): Promise<any> {
  if ((window as any).google && (window as any).google.maps) {
    return (window as any).google;
  }
  if (loadPromise) return loadPromise;

  const key = apiKey ?? (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string);
  if (!key) {
    throw new Error(
      "Google Maps API key not provided (set VITE_GOOGLE_MAPS_API_KEY in .env)",
    );
  }

  loadPromise = new Promise((resolve, reject) => {
    let settled = false;

    // Google calls this global if the key/project is invalid, unbilled,
    // has the wrong API disabled, or referrer restrictions block this origin.
    (window as any).gm_authFailure = () => {
      if (settled) return;
      settled = true;
      loadPromise = null;
      reject(new GoogleMapsAuthError());
    };

    const existing = document.querySelector(
      `script[data-google-maps]`,
    ) as HTMLScriptElement | null;

    const handleLoad = () => {
      // Give gm_authFailure a moment to fire before declaring success —
      // Google fires it asynchronously right after the script evaluates.
      setTimeout(() => {
        if (settled) return;
        if ((window as any).google && (window as any).google.maps) {
          settled = true;
          resolve((window as any).google);
        } else {
          settled = true;
          loadPromise = null;
          reject(new Error("Google Maps script loaded but window.google is missing"));
        }
      }, 150);
    };

    const handleError = () => {
      if (settled) return;
      settled = true;
      loadPromise = null;
      reject(new Error("Failed to load the Google Maps script (network error)"));
    };

    if (existing) {
      existing.addEventListener("load", handleLoad);
      existing.addEventListener("error", handleError);
      return;
    }

    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async`;
    s.async = true;
    s.defer = true;
    s.setAttribute("data-google-maps", "1");
    s.onload = handleLoad;
    s.onerror = handleError;
    document.head.appendChild(s);
  });

  return loadPromise;
}