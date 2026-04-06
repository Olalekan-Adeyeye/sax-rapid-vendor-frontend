"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { tokenStorage } from "../api/apiClient";
import type { UserProfile } from "../api/types/auth.types";
import { mapUserToProfile } from "../api/types/user.types";
import { getUserProfile } from "../api/services/user";

interface AuthContextType {
	user: UserProfile | null;
	loading: boolean;
	isTwoFactorVerified: boolean;
	setUser: (user: UserProfile | null) => void;
	updateUser: (data: Partial<UserProfile>) => void;
	refreshProfile: () => Promise<void>;
	setTwoFactorVerified: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(() => {
		// Check session storage on initial load
		if (typeof window !== "undefined") {
			return sessionStorage.getItem("is2faVerified") === "true";
		}
		return false;
	});

	// ─── Hydration ──────────────────────────────────────────────────────────────

	useEffect(() => {
		const hydrate = async () => {
			const token = tokenStorage.getToken();
			const refreshToken = tokenStorage.getRefreshToken();

			// Only attempt hydration if both tokens exist
			if (!token || !refreshToken) {
				setLoading(false);
				return;
			}

			try {
				const profileData = await getUserProfile();
				setUser(mapUserToProfile(profileData));
			} catch (err) {
				console.error("Hydration failed:", err);
				// If profile fetch fails, we don't clear tokens here to allow for
				// potential automatic refresh by the apiClient, but we set user to null.
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		hydrate();
	}, []);

	const updateUser = (data: Partial<UserProfile>) => {
		setUser((prev) => (prev ? { ...prev, ...data } : null));
	};

	const refreshProfile = async () => {
		try {
			const profileData = await getUserProfile();
			setUser(mapUserToProfile(profileData));
		} catch (err) {
			console.error("Profile refresh failed:", err);
		}
	};

	const setTwoFactorVerified = (value: boolean) => {
		setIsTwoFactorVerified(value);
		if (typeof window !== "undefined") {
			if (value) {
				sessionStorage.setItem("is2faVerified", "true");
			} else {
				sessionStorage.removeItem("is2faVerified");
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				isTwoFactorVerified,
				setUser,
				updateUser,
				refreshProfile,
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
