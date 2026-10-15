/**
 * Delivery providers — single source of truth.
 * Must stay in sync with the vendor swagger `DeliveryProvider` enum.
 */
export const DELIVERY_PROVIDER_OPTIONS = [
	{ id: "Sendbox", label: "Sendbox", keywords: ["sendbox"] },
	{
		id: "TheCourierGuy",
		label: "The Courier Guy",
		keywords: ["thecourierguy", "courierguy", "courier"],
	},
	{ id: "Shipbubble", label: "Shipbubble", keywords: ["shipbubble"] },
	{ id: "BobGo", label: "Bob Go", keywords: ["bobgo"] },
	{ id: "Uber", label: "Uber", keywords: ["uber"] },
	{ id: "Bolt", label: "Bolt", keywords: ["bolt"] },
	{ id: "Manual", label: "Manual", keywords: ["manual"] },
] as const;

export type DeliveryProvider = (typeof DELIVERY_PROVIDER_OPTIONS)[number]["id"];

export type DeliveryStatus =
	| "Pending"
	| "Requested"
	| "RiderAssigned"
	| "PickedUp"
	| "InTransit"
	| "Delivered"
	| "Failed"
	| "Cancelled";

/** One shipment row as returned by GET /api/Delivery/{orderId}/status. */
export interface ShipmentInfo {
	id?: string | null;
	orderId?: string | null;
	provider?: string | null;
	providerCode?: string | null;
	providerDisplayName?: string | null;
	serviceName?: string | null;
	serviceType?: string | null;
	trackingCode?: string | null;
	riderName?: string | null;
	riderPhone?: string | null;
	estimatedCost?: number | null;
	currency?: string | null;
	status?: string | null;
	estimatedDeliveryAt?: string | null;
	pickedUpAt?: string | null;
	deliveredAt?: string | null;
	createdAt?: string | null;
	vendorId?: string | null;
	isQueued?: boolean;
	isBooked?: boolean;
}

/** Raw payload of GET /api/Delivery/{orderId}/status. */
export interface DeliveryStatusResponse {
	orderId?: string | null;
	shipments?: ShipmentInfo[] | null;
	legacyDelivery?: ShipmentInfo | null;
}

export const TERMINAL_DELIVERY_STATUSES = [
	"Delivered",
	"Failed",
	"Cancelled",
] as const;

export function isTerminalDeliveryStatus(status?: string | null): boolean {
	return (
		!!status &&
		(TERMINAL_DELIVERY_STATUSES as readonly string[]).includes(status)
	);
}

/**
 * Picks the shipment the UI should act on:
 * first non-terminal shipment, else the most recent shipment,
 * else the legacy delivery.
 */
export function pickActiveShipment(
	shipments: ShipmentInfo[] | null | undefined,
	legacy: ShipmentInfo | null | undefined,
): ShipmentInfo | null {
	const list = (shipments ?? []).filter(
		(shipment): shipment is ShipmentInfo => !!shipment,
	);
	const active = list.find((shipment) => !isTerminalDeliveryStatus(shipment.status));
	if (active) return active;
	if (list.length > 0) return list[list.length - 1];
	return legacy ?? null;
}

/** Case/space-insensitive comparison key for provider names and codes. */
export function normalizeProviderKey(value: string): string {
	return value.toLowerCase().replace(/[\s_\-.]+/g, "");
}

/**
 * Maps a provider name or code (e.g. "The Courier Guy", "SENDBOX",
 * "shipbubble") to a known DeliveryProvider.
 * Returns null for anything unrecognized — callers must NOT fall back to
 * "Manual", or a wrong provider gets booked silently.
 */
export function resolveDeliveryProvider(
	nameOrCode: string | null | undefined,
): DeliveryProvider | null {
	if (!nameOrCode) return null;
	const key = normalizeProviderKey(nameOrCode);
	if (!key) return null;

	for (const option of DELIVERY_PROVIDER_OPTIONS) {
		if (key === normalizeProviderKey(option.id)) return option.id;
	}
	for (const option of DELIVERY_PROVIDER_OPTIONS) {
		if (option.keywords.some((keyword) => key.includes(normalizeProviderKey(keyword)))) {
			return option.id;
		}
	}
	return null;
}
