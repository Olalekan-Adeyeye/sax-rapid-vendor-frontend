"use client";
import React from "react";
import { Star, Reply, User, MoreVertical, ThumbsUp } from "lucide-react";

export default function ReviewsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black capitalize">
						Reviews & Ratings
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Understand your customer experience and feedback
					</p>
				</div>
				<div className="flex bg-white border border-gray-100 rounded p-1">
					<button className="px-6 py-2.5 rounded bg-gold text-[9px] font-black uppercase tracking-widest text-black transition-all">
						All Reviews
					</button>
					<button className="px-6 py-2.5 rounded hover:bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">
						Pending Reply
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-3">
					<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
						Average Rating
					</p>
					<h3 className="text-4xl font-black text-black">4.8</h3>
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((s) => (
							<Star
								key={s}
								size={14}
								className={s <= 4 ? "fill-gold text-gold" : "text-gray-100"}
							/>
						))}
					</div>
					<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 truncate">
						Based on 1,284 reviews
					</p>
				</div>
				{[
					{ label: "Positive", val: 92, color: "bg-green-500" },
					{ label: "Neutral", val: 6, color: "bg-gold" },
					{ label: "Negative", val: 2, color: "bg-red-500" },
				].map((stat, i) => (
					<div
						key={i}
						className="bg-white border border-gray-100 rounded p-8 space-y-4"
					>
						<div className="flex items-center justify-between">
							<p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
								{stat.label}
							</p>
							<span className="text-[11px] font-black text-black">
								{stat.val}%
							</span>
						</div>
						<div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
							<div
								className={`h-full ${stat.color} rounded-full`}
								style={{ width: `${stat.val}%` }}
							/>
						</div>
						<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
							Total volume analysis
						</p>
					</div>
				))}
			</div>

			<div className="space-y-6">
				{[
					{
						user: "Sarah Smith",
						rating: 5,
						product: "Premium Watch 5",
						comment:
							"Absolutely love the quality! It exceeded my expectations. Fast shipping too.",
						date: "10m ago",
						replied: false,
					},
					{
						user: "Michael Obi",
						rating: 4,
						product: "Studio Headphones",
						comment:
							"Great sound, but the ear pads could be a bit more comfortable.",
						date: "2d ago",
						replied: true,
					},
					{
						user: "John Wilson",
						rating: 5,
						product: "Speed Sneakers",
						comment:
							"Best running shoes I've ever owned. Very light and stylish.",
						date: "1w ago",
						replied: true,
					},
				].map((review, i) => (
					<div
						key={i}
						className="bg-white border border-gray-100 rounded overflow-hidden group"
					>
						<div className="p-8">
							<div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
								<div className="flex gap-4">
									<div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 shrink-0 border border-gray-100">
										<User size={20} />
									</div>
									<div>
										<div className="flex items-center gap-3 mb-1">
											<h4 className="text-[11px] font-black uppercase tracking-widest text-black">
												{review.user}
											</h4>
											<div className="flex gap-0.5">
												{[1, 2, 3, 4, 5].map((s) => (
													<Star
														key={s}
														size={10}
														className={
															s <= review.rating
																? "fill-gold text-gold"
																: "text-gray-100"
														}
													/>
												))}
											</div>
										</div>
										<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
											Verified Buyer · {review.date}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-[9px] font-black uppercase tracking-widest text-gray-400 shrink-0">
										Reviewed for:
									</span>
									<span className="text-[9px] font-black uppercase tracking-widest text-black bg-gray-50 px-3 py-1.5 rounded">
										{review.product}
									</span>
								</div>
							</div>

							<p className="text-sm font-medium text-gray-500 leading-relaxed max-w-2xl">
								{review.comment}
							</p>

							<div className="flex items-center gap-6 mt-8">
								<button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
									<ThumbsUp size={14} />
									Helpful (1)
								</button>
								<button
									className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${review.replied ? "text-gold" : "text-gray-400 hover:text-black"}`}
								>
									<Reply size={14} />
									{review.replied ? "View Reply" : "Reply to review"}
								</button>
								<button className="text-gray-300 hover:text-black transition-colors ml-auto">
									<MoreVertical size={16} />
								</button>
							</div>
						</div>

						{review.replied && (
							<div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
								<div className="flex gap-4">
									<div className="w-1 h-auto bg-gold rounded-full shrink-0" />
									<div>
										<p className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
											Store Manager Response
										</p>
										<p className="text-xs font-medium text-gray-400 leading-relaxed italic">
											&quot;Thank you for your feedback! We&apos;re glad you like the
											sound quality. We&apos;ll take your notes about the comfort
											into account for future improvements.&quot;
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<button className="w-full py-5 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all">
				Load More Reviews
			</button>
		</div>
	);
}
