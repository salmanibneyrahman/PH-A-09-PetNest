"use client";

import { createContext, useContext } from "react";
import { useSession, signOut as clientSignOut } from "@/lib/auth-client";

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }) {
    const { data: session, isPending, error } = useSession();
    const signOut = async () => {
        try {
            await clientSignOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = "/";
                    }
                }
            });
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user: session?.user || null,
                isAuthenticated: !!session?.user,
                isLoading: isPending,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
