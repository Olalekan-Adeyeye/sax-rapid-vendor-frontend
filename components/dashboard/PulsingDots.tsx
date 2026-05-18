export function PulsingDots() {
	return (
		<span className="flex items-center tracking-tighter">
			<span className="animate-[pulse_1.5s_ease-in-out_infinite]">.</span>
			<span className="animate-[pulse_1.5s_ease-in-out_0.2s_infinite]">.</span>
			<span className="animate-[pulse_1.5s_ease-in-out_0.4s_infinite]">.</span>
		</span>
	);
}
