import { useEffect } from "react";

// Captured as early as possible (module evaluation, right as the JS bundle
// starts running) so the minimum-visible-time calculation below reflects
// real boot time, not just React's commit time.
const bootTime = typeof performance !== "undefined" ? performance.now() : 0;
const MIN_VISIBLE_MS = 550;

/**
 * Renders nothing — its only job is to fade out and remove the static
 * #app-preloader element (defined in index.html so it paints before any JS
 * runs) once the app has mounted. A minimum visible time avoids a jarring
 * flicker on fast connections where the app boots in a handful of ms.
 */
export default function PreloaderController() {
  useEffect(() => {
    const el = document.getElementById("app-preloader");
    if (!el) return;

    const elapsed = performance.now() - bootTime;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const timer = setTimeout(() => {
      el.classList.add("preloader-hidden");
      setTimeout(() => el.remove(), 550);
    }, remaining);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
