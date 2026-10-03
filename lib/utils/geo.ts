/**
 * Format a lat/lng pair with correct hemisphere suffixes.
 * (Avoids hard-coding °N/°E, which mislabels the southern/western hemisphere.)
 */
export function formatCoords(
	lat: number,
	lng: number,
	decimals = 6,
): string {
	const latSuffix = lat >= 0 ? "N" : "S";
	const lngSuffix = lng >= 0 ? "E" : "W";
	return `${Math.abs(lat).toFixed(decimals)}°${latSuffix}, ${Math.abs(lng).toFixed(decimals)}°${lngSuffix}`;
}

/** Human-readable GPS accuracy, e.g. "±12 m". */
export function formatAccuracy(meters: number | null | undefined): string {
	if (meters === null || meters === undefined) return "";
	return `±${Math.round(meters)} m`;
}
