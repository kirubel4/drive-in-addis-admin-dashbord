let loadPromise: Promise<any> | null = null;
export async function loadGoogleMaps(apiKey?: string) {
  if ((window as any).google && (window as any).google.maps)
    return (window as any).google;
  if (loadPromise) return loadPromise;

  const key = apiKey ?? (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string);
  if (!key)
    throw new Error(
      "Google Maps API key not provided (VITE_GOOGLE_MAPS_API_KEY)",
    );

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).google));
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps")),
      );
      return;
    }

    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
    s.async = true;
    s.defer = true;
    s.setAttribute("data-google-maps", "1");
    s.onload = () => resolve((window as any).google);
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });

  return loadPromise;
}
