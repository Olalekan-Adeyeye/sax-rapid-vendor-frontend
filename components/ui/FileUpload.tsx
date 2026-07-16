import React, { useRef, useState } from "react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "application/pdf"];

interface FileUploadProps {
	label: string;
	id: string;
	onChange: (file: File | null) => void;
	accept?: string;
	file?: File | null;
	error?: string;
}

export function FileUpload({
	label,
	id,
	onChange,
	accept,
	file,
	error,
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [internalError, setInternalError] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		setInternalError("");

		if (selectedFile) {
			if (!ALLOWED_TYPES.includes(selectedFile.type)) {
				setInternalError("Only PNG, JPG or PDF files are allowed");
				onChange(null);
				return;
			}
			if (selectedFile.size > MAX_SIZE_BYTES) {
				setInternalError("File size must be less than 5MB");
				onChange(null);
				return;
			}
		}

		onChange(selectedFile);
	};

	const displayError = error || internalError;

	return (
		<div className="flex flex-col gap-2">
			<label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
				{label}
			</label>
			<div
				onClick={() => inputRef.current?.click()}
				className={`w-full bg-gray-50 border border-dashed rounded px-4 py-8 text-center cursor-pointer transition-all group ${
					displayError
						? "border-red-500 bg-red-50/10"
						: "border-gray-200 hover:border-gold/40"
				}`}
			>
				<input
					ref={inputRef}
					type="file"
					id={id}
					className="hidden"
					onChange={handleFileChange}
					accept={accept || ".png,.jpg,.jpeg,.pdf"}
				/>
				<div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">
					{file ? "✅" : "📄"}
				</div>
				<p
					className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
						file
							? "text-black"
							: displayError
								? "text-red-500"
								: "text-gray-500 group-hover:text-gold"
					}`}
				>
					{file ? file.name : "Click to upload document"}
				</p>
				<p className="text-[9px] text-gray-700 mt-1 uppercase font-bold tracking-tighter">
					PNG, JPG or PDF (Max 5MB)
				</p>
			</div>
			{displayError && (
				<p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5 animate-in fade-in slide-in-from-top-1">
					{displayError}
				</p>
			)}
		</div>
	);
}
