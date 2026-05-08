"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Rocket, Calendar, Type, Percent } from "lucide-react";

interface CreateCampaignModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateCampaignModal({
	isOpen,
	onClose,
}: CreateCampaignModalProps) {
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			setLoading(false);
			onClose();
		}, 1500);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Start Promotional Campaign"
			subtitle="Launch store-wide sales or seasonal events"
			icon={Rocket}
			size="lg"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				<Input
					id="campaign-name"
					label="Campaign Name"
					placeholder="e.g. Easter Mega Sale"
					required
					leftSlot={<Type size={14} className="text-gray-400" />}
				/>

				<div className="grid grid-cols-1 gap-2">
					<Input
						id="campaign-discount"
						label="Storewide Discount (%)"
						type="number"
						placeholder="e.g. 15"
						required
						leftSlot={<Percent size={14} className="text-gray-400" />}
					/>
					<div className="flex flex-col justify-end pb-3 text-[10px] font-black uppercase text-gray-400 tracking-widest leading-relaxed">
						* This discount will apply to all products in your store.
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Input
						id="campaign-start"
						label="Start Date"
						type="date"
						required
						leftSlot={<Calendar size={14} className="text-gray-400" />}
					/>
					<Input
						id="campaign-end"
						label="End Date"
						type="date"
						required
						leftSlot={<Calendar size={14} className="text-gray-400" />}
					/>
				</div>

				<div className="pt-4">
					<Button type="submit" loading={loading} variant="black" fullWidth>
						Launch Campaign
					</Button>
				</div>
			</form>
		</Modal>
	);
}
