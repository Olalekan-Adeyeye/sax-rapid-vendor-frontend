import React, { useRef, useState } from "react";

interface FileUploadProps {
	label: string;
	id: string;
	onChange: (file: File | null) => void;
	accept?: string;
}

export function FileUpload({ label, id, onChange, accept }: FileUploadProps) {
	const [fileName, setFileName] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFileName(file ? file.name : null);
		onChange(file);
	};

	return (
		<div className="flex flex-col gap-2">
			<label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
				{label}
			</label>
			<div
				onClick={() => inputRef.current?.click()}
				className="w-full bg-gray-50 border border-dashed border-gray-200 rounded px-4 py-8 text-center cursor-pointer hover:border-gold/40 transition-all group"
			>
				<input
					ref={inputRef}
					type="file"
					id={id}
					className="hidden"
					onChange={handleFileChange}
					accept={accept}
				/>
				<div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">
					📄
				</div>
				<p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gold transition-colors">
					{fileName || "Click to upload document"}
				</p>
				<p className="text-[9px] text-gray-700 mt-1 uppercase font-bold tracking-tighter">
					PNG, JPG or PDF (Max 5MB)
				</p>
			</div>
		</div>
	);
}
