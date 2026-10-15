import { describe, expect, it } from "vitest";

import {
	DELIVERY_PROVIDER_OPTIONS,
	isTerminalDeliveryStatus,
	pickActiveShipment,
	resolveDeliveryProvider,
} from "./delivery.types";
import type { ShipmentInfo } from "./delivery.types";

const shipment = (
	overrides: Partial<ShipmentInfo> & { id: string; status: string },
): ShipmentInfo => ({ ...overrides });

describe("resolveDeliveryProvider", () => {
	it("matches provider codes case-insensitively", () => {
		expect(resolveDeliveryProvider("SENDBOX")).toBe("Sendbox");
		expect(resolveDeliveryProvider("bobgo")).toBe("BobGo");
		expect(resolveDeliveryProvider("SHIPBUBBLE")).toBe("Shipbubble");
		expect(resolveDeliveryProvider("TheCourierGuy")).toBe("TheCourierGuy");
	});

	it("matches human-readable names and marketing names", () => {
		expect(resolveDeliveryProvider("The Courier Guy")).toBe("TheCourierGuy");
		expect(resolveDeliveryProvider("courier guy")).toBe("TheCourierGuy");
		expect(resolveDeliveryProvider("Bob Go")).toBe("BobGo");
		expect(resolveDeliveryProvider("Uber Direct")).toBe("Uber");
	});

	it("returns null for unknown names instead of falling back to Manual", () => {
		expect(resolveDeliveryProvider("DHL Express")).toBeNull();
		expect(resolveDeliveryProvider("GIG Logistics")).toBeNull();
		expect(resolveDeliveryProvider("")).toBeNull();
		expect(resolveDeliveryProvider(null)).toBeNull();
		expect(resolveDeliveryProvider(undefined)).toBeNull();
	});
});

describe("DELIVERY_PROVIDER_OPTIONS", () => {
	it("covers every provider in the vendor swagger enum", () => {
		expect(DELIVERY_PROVIDER_OPTIONS.map((option) => option.id).sort()).toEqual(
			[
				"BobGo",
				"Bolt",
				"Manual",
				"Sendbox",
				"Shipbubble",
				"TheCourierGuy",
				"Uber",
			],
		);
	});
});

describe("isTerminalDeliveryStatus", () => {
	it("treats Delivered, Failed and Cancelled as terminal", () => {
		expect(isTerminalDeliveryStatus("Delivered")).toBe(true);
		expect(isTerminalDeliveryStatus("Failed")).toBe(true);
		expect(isTerminalDeliveryStatus("Cancelled")).toBe(true);
	});

	it("treats in-flight statuses as non-terminal", () => {
		expect(isTerminalDeliveryStatus("Pending")).toBe(false);
		expect(isTerminalDeliveryStatus("Requested")).toBe(false);
		expect(isTerminalDeliveryStatus("InTransit")).toBe(false);
		expect(isTerminalDeliveryStatus(null)).toBe(false);
		expect(isTerminalDeliveryStatus("")).toBe(false);
	});
});

describe("pickActiveShipment", () => {
	it("prefers the first non-terminal shipment", () => {
		const done = shipment({ id: "a", status: "Delivered" });
		const active = shipment({ id: "b", status: "InTransit" });
		const later = shipment({ id: "c", status: "Requested" });
		expect(pickActiveShipment([done, active, later], null)).toBe(active);
	});

	it("falls back to the most recent shipment when all are terminal", () => {
		const first = shipment({ id: "a", status: "Failed" });
		const last = shipment({ id: "b", status: "Cancelled" });
		expect(pickActiveShipment([first, last], null)).toBe(last);
	});

	it("uses the legacy delivery when there are no shipments", () => {
		const legacy = shipment({ id: "legacy", status: "Pending" });
		expect(pickActiveShipment([], legacy)).toBe(legacy);
		expect(pickActiveShipment(undefined, legacy)).toBe(legacy);
	});

	it("returns null when nothing exists", () => {
		expect(pickActiveShipment([], null)).toBeNull();
		expect(pickActiveShipment(null, null)).toBeNull();
		expect(pickActiveShipment(undefined, undefined)).toBeNull();
	});
});
