import Image from "next/image";

export default function Loading() {
	return (
		<div className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-white antialiased">
			<div className="relative flex flex-col items-center">
				<div
					className="relative shrink-0 flex items-center justify-center"
					style={{ width: 100, height: 100 }}
				>
					<Image
						src="/assets/icons/SRM-Logo.png"
						alt="SAX-RAPID"
						width={64}
						height={64}
						className="object-contain animate-pulse"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
