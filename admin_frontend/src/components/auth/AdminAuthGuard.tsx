"use client";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function AdminAuthGuardInner({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-100">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Wraps admin layout content. Fetches /me on mount, redirects to signin on 401.
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminAuthGuardInner>{children}</AdminAuthGuardInner>
        </AuthProvider>
    );
}
