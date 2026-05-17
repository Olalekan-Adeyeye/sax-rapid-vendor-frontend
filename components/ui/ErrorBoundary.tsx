"use client";

import React from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center min-h-100 animate-in fade-in duration-700">
					<h2 className="text-xl lg:text-2xl font-black tracking-tighter text-black mb-3">
						Something went wrong
					</h2>
					<p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center leading-relaxed max-w-md mb-8">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<div className="flex flex-col sm:flex-row items-center gap-3">
						<button
							onClick={this.handleReset}
							className="px-8 py-3 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-none flex items-center gap-2"
						>
							<RefreshCw size={14} />
							Try Again
						</button>
						<Link
							href="/dashboard"
							className="px-8 py-3 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all"
						>
							Dashboard
						</Link>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
