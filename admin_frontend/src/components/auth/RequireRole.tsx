"use client";

import { useAuth, StaffRole } from "@/contexts/AuthContext";

interface RequireRoleProps {
    roles: StaffRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has one of the allowed roles.
 * Use for role-based visibility (e.g. sidebar items, buttons).
 */
export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!user) return <>{fallback}</>;
    if (!roles.includes(user.role)) return <>{fallback}</>;

    return <>{children}</>;
}
