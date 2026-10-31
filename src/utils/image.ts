const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:8742';

// Placeholder SVG as data URL
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23D1FAE5'/%3E%3Crect x='160' y='140' width='80' height='60' rx='4' fill='%23065F46' opacity='0.3'/%3E%3Ccircle cx='180' cy='155' r='12' fill='%23065F46' opacity='0.4'/%3E%3Cpolygon points='160,200 200,160 240,200' fill='%23065F46' opacity='0.4'/%3E%3Crect x='150' y='200' width='100' height='10' rx='5' fill='%23065F46' opacity='0.2'/%3E%3Crect x='165' y='218' width='70' height='8' rx='4' fill='%23065F46' opacity='0.15'/%3E%3C/svg%3E`;

/**
 * Given a relative path from the backend (e.g. "/media/products/img.jpg"),
 * prepend the media base URL. Returns a placeholder if null/empty.
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return PLACEHOLDER_SVG;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/media/')) return `${MEDIA_BASE_URL}${path}`;
  if (path.startsWith('data:')) return path;
  return PLACEHOLDER_SVG;
}

export { PLACEHOLDER_SVG };
