"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { registerUserInDB } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { data: session, isPending } = useSession();
    const [hasRegistered, setHasRegistered] = useState(false);

    const user = session?.user || null;

    const syncUserToDB = useCallback(async (sessionUser) => {
        if (!sessionUser?.email || hasRegistered) return;
        try {
            await registerUserInDB({
                name: sessionUser.name || "",
                email: sessionUser.email,
                photoURL: sessionUser.image || "",
            });
            setHasRegistered(true);
        } catch (error) {
            console.error("DB sync error (non-critical):", error);
            setHasRegistered(true);
        }
    }, [hasRegistered]);

    useEffect(() => {
        if (user?.email) {
            syncUserToDB(user);
        } else {
            setHasRegistered(false);
        }
    }, [user, syncUserToDB]);

    const handleSignOut = useCallback(async () => {
        try {
            await signOut();
            setHasRegistered(false);
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }, []);

    const value = {
        user,
        isLoading: isPending,
        isAuthenticated: !!user,
        signOut: handleSignOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}