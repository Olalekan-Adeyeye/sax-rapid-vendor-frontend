import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

interface TopSellerCardProps {
	image: string;
	name: string;
	sales: string;
	revenue: string;
	productId: string;
}

export function TopSellerCard({
	image,
	name,
	sales,
	revenue,
	productId,
}: TopSellerCardProps) {
	const isPlaceholder = !image || image === "";

	return (
		<div className="bg-white border border-gray-100 rounded overflow-hidden group hover:border-gold hover:shadow-lg transition-all flex flex-col">
			<div className="aspect-square bg-gray-50 overflow-hidden relative flex items-center justify-center">
				{isPlaceholder ? (
					<div className="w-1/2 h-1/2 relative filter grayscale">
						<Image
							src="/assets/icons/SaxRapid-Logo.png"
							alt="Product placeholder"
							fill
							className="object-contain"
						/>
					</div>
				) : (
					<Image
						src={image}
						alt={name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
					/>
				)}
				<div className="absolute top-3 right-3 z-20">
					<Link
						href={`/products/${productId}`}
						className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-black hover:bg-gold transition-colors shadow-sm block"
					>
						<ArrowUpRight size={14} />
					</Link>
				</div>
			</div>
			<div className="p-4 flex-1 flex flex-col">
				<p className="text-[10px] font-bold text-gray-400 mb-1">Top Seller</p>
				<Link
					href={`/products/${productId}`}
					className="block mb-3 hover:text-gold transition-colors"
				>
					<h4 className="text-sm font-bold text-black tracking-tight truncate">
						{name}
					</h4>
				</Link>

				<div className="space-y-4 mt-auto">
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-black">
							<ShoppingBag size={14} className="text-gold" />
							<span className="text-xs font-bold">{sales} Units Sold</span>
						</div>
					</div>

					<div className="pt-3 border-t border-gray-50">
						<p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
							Revenue Generated
						</p>
						<p className="text-sm font-black text-black">{revenue}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
