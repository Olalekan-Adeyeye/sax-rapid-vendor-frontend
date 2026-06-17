"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { X, MapPin, Trash2, Crosshair } from "lucide-react";
import { Button } from "./Button";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.divIcon({
	className: "",
	html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#EAB308" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
	iconSize: [32, 32],
	iconAnchor: [16, 32],
});

interface LocationPickerProps {
	onClose: () => void;
	onConfirm: (lat: number, lng: number) => void;
	onClear: () => void;
	initialLat?: number;
	initialLng?: number;
}

function ClickHandler({
	onClick,
}: {
	onClick: (lat: number, lng: number) => void;
}) {
	useMapEvents({
		click(e) {
			onClick(e.latlng.lat, e.latlng.lng);
		},
	});
	return null;
}

export function LocationPicker({
	onClose,
	onConfirm,
	onClear,
	initialLat,
	initialLng,
}: LocationPickerProps) {
	const [mounted, setMounted] = useState(false);
	const [lat, setLat] = useState<number | null>(initialLat ?? null);
	const [lng, setLng] = useState<number | null>(initialLng ?? null);
	const markerRef = useRef<L.Marker | null>(null);

	useEffect(() => {
		const timer = setTimeout(() => setMounted(true), 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	const handleMapClick = useCallback((clickedLat: number, clickedLng: number) => {
		setLat(clickedLat);
		setLng(clickedLng);
	}, []);

	const handleConfirm = useCallback(() => {
		if (lat !== null && lng !== null) {
			onConfirm(lat, lng);
		}
		onClose();
	}, [lat, lng, onConfirm, onClose]);

	const handleClear = useCallback(() => {
		setLat(null);
		setLng(null);
		onClear();
	}, [onClear]);

	const center: [number, number] = useMemo(() => {
		if (initialLat && initialLng) return [initialLat, initialLng];
		return [9.082, 8.6753]; // Nigeria center as default
	}, [initialLat, initialLng]);

	const handleDragEnd = useCallback((e: L.LeafletEvent) => {
		const marker = e.target as L.Marker;
		const pos = marker.getLatLng();
		setLat(pos.lat);
		setLng(pos.lng);
	}, []);

	if (!mounted) return null;

	const content = (
		<>
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-[9998]"
				onClick={onClose}
			/>
			<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
				<div className="bg-white rounded w-full max-w-3xl overflow-hidden shadow-2xl shadow-black/20 animate-in fade-in zoom-in duration-200">
					{/* Header */}
					<div className="p-6 border-b border-gray-50 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-black border border-gray-100">
								<MapPin size={20} />
							</div>
							<div>
								<h3 className="text-sm font-black uppercase tracking-widest text-black">
									Set Pickup Location
								</h3>
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
									Click on the map to place a pin
								</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className="text-gray-300 hover:text-black transition-colors p-2"
						>
							<X size={20} />
						</button>
					</div>

					{/* Map */}
					<div className="h-[50vh] min-h-[320px] relative">
						<MapContainer
							center={center}
							zoom={6}
							className="h-full w-full"
							zoomControl={true}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<ClickHandler onClick={handleMapClick} />
							{lat !== null && lng !== null && (
								<Marker
									position={[lat, lng]}
									icon={DefaultIcon}
									draggable={true}
									ref={markerRef}
									eventHandlers={{ dragend: handleDragEnd }}
								/>
							)}
						</MapContainer>
					</div>

					{/* Coordinates readout */}
					{lat !== null && lng !== null && (
						<div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
							<p className="text-xs font-bold text-black text-center">
								{lat.toFixed(6)}°N, {lng.toFixed(6)}°E
							</p>
						</div>
					)}

					{/* Actions */}
					<div className="p-6 border-t border-gray-100 flex items-center justify-between">
						<div>
							{lat !== null && lng !== null ? (
								<button
									type="button"
									onClick={handleClear}
									className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5"
								>
									<Trash2 size={12} />
									Clear Location
								</button>
							) : (
								<span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									<Crosshair size={12} className="inline mr-1" />
									Click the map to set location
								</span>
							)}
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="sm"
								onClick={onClose}
								className="px-6 text-[10px] uppercase font-black tracking-widest"
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								size="sm"
								onClick={handleConfirm}
								disabled={lat === null || lng === null}
								className="px-6 text-[10px] uppercase font-black tracking-widest"
							>
								Confirm Location
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);

	return createPortal(content, document.body);
}
