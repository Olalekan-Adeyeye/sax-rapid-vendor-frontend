"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { tokenStorage } from "../api/apiClient";
import { cookies } from "../utils/cookies";
import type { UserProfile } from "../api/types/auth.types";
import { mapUserToProfile } from "../api/types/user.types";
import { getUserProfile } from "../api/services/user";
import type { VendorProfileResponse } from "../api/types/vendor.types";
import { getMyVendorProfile } from "../api/services/vendor";

interface AuthContextType {
	user: UserProfile | null;
	loading: boolean;
	isTwoFactorVerified: boolean;
	vendorProfile: VendorProfileResponse | null | undefined;
	vendorLoading: boolean;
	setUser: (user: UserProfile | null) => void;
	updateUser: (data: Partial<UserProfile>) => void;
	refreshProfile: () => Promise<void>;
	refreshVendorProfile: () => Promise<void>;
	setTwoFactorVerified: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient();
	const [token, setToken] = useState<string | null>(() =>
		typeof window !== "undefined" ? tokenStorage.getToken() : null,
	);

	const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(() => {
		if (typeof window !== "undefined") {
			return cookies.get("sax_2fa") === "true";
		}
		return false;
	});

	const { data: userProfile, isPending: userPending } = useQuery({
		queryKey: ["auth", "user"],
		queryFn: () => getUserProfile().then(mapUserToProfile),
		enabled: !!token,
	});

	const {
		data: vendorData,
		isPending: vendorPending,
		isFetching: vendorFetching,
		isError: isVendorError,
		error: vendorError,
	} = useQuery({
		queryKey: ["auth", "vendor"],
		queryFn: getMyVendorProfile,
		enabled: !!userProfile,
	});

	const loading = !!token && userPending;
	const vendorLoading = !!userProfile && (vendorPending || vendorFetching);

	const user = userProfile ?? null;
	const vendorProfile =
		isVendorError &&
		axios.isAxiosError(vendorError) &&
		vendorError.response?.status === 404
			? null
			: vendorData;

	const setUser = (userData: UserProfile | null) => {
		queryClient.setQueryData(["auth", "user"], userData);
		setToken(tokenStorage.getToken());
	};

	const updateUser = (data: Partial<UserProfile>) => {
		queryClient.setQueryData(["auth", "user"], (prev: UserProfile | null) =>
			prev ? { ...prev, ...data } : null,
		);
	};

	const refreshProfile = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
	};

	const refreshVendorProfile = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth", "vendor"] });
	};

	const setTwoFactorVerified = (value: boolean) => {
		setIsTwoFactorVerified(value);
		if (typeof window !== "undefined") {
			if (value) {
				cookies.set("sax_2fa", "true");
			} else {
				cookies.remove("sax_2fa");
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user: user ?? null,
				loading,
				vendorProfile,
				vendorLoading,
				isTwoFactorVerified,
				setUser,
				updateUser,
				refreshProfile,
				refreshVendorProfile,
				setTwoFactorVerified,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
