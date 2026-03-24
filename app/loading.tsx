import Image from "next/image";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-white antialiased">
			<div className="relative flex flex-col items-center">
				<div
					className="relative shrink-0 flex items-center justify-center"
					style={{ width: 100, height: 100 }}
				>
					{/* Primary Spinner Ring */}
					<div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-[spin_1.5s_linear_infinite]" />

					{/* Subtle Pulse Ring */}
					<div className="absolute inset-2 rounded-full border border-gold/5 animate-pulse" />

					{/* Center Logo Icon */}
					<div className="relative w-12 h-12 flex items-center justify-center">
						<Image
							src="/assets/icons/SaxRapid-Logo.png"
							alt="SAX-RAPID"
							width={48}
							height={48}
							className="object-contain"
							priority
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
