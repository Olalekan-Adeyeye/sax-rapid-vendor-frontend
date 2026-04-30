import { VariationDetails, VariationAttributeDTO } from "../api/types/orders.types";

/**
 * Formats variation details from various possible API formats (string, JSON string, or object).
 * @param details The variation details from the API
 * @returns A formatted string or null
 */
export function formatVariationDetails(details: VariationDetails): string | null {
	if (!details) return null;

	let data = details;

	// Handle stringified JSON
	if (typeof details === "string") {
		try {
			const parsed = JSON.parse(details);
			if (parsed && typeof parsed === "object") {
				data = parsed;
			} else {
				return details; // Regular string
			}
		} catch {
			return details; // Regular string
		}
	}

	// Handle object structure
	if (typeof data === "object" && data !== null) {
		// Priority 1: Attributes (Record or Array)
		if (data.attributes) {
			if (Array.isArray(data.attributes)) {
				return data.attributes
					.map((attr: VariationAttributeDTO) => {
						const name = attr.attributeName || attr.name;
						const value = attr.attributeValue || attr.value;
						return name && value ? `${name}: ${value}` : null;
					})
					.filter(Boolean)
					.join(" / ");
			} else if (typeof data.attributes === "object") {
				return Object.entries(data.attributes)
					.map(([key, val]) => `${key}: ${val}`)
					.join(" / ");
			}
		}

		// Priority 2: Simple values fallback
		if (data.sku) return `SKU: ${data.sku}`;
		
		// Priority 3: Join any string/number values
		const values = Object.values(data).filter(
			(v) => typeof v === "string" || typeof v === "number",
		);
		if (values.length > 0) return values.join(" / ");
	}

	return typeof details === "string" ? details : null;
}
