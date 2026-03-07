"use client"
import { AllUsersDataTable } from "@/components/user_management/allUsersDataTable"
import { allUsersColumns, type UserColumnInterface, KYCStatus } from "@/components/user_management/allUsersColumns"
import { api } from "@/lib/api";
import { useState, useEffect } from "react";

type KycItem = {
    type: "AADHARCARD" | "PANCARD";
    status: "PENDING" | "VERIFIED" | "REJECTED";
};

type PropertyItem = {
    id: string;
    status:
    | "ACTIVE"
    | "UNLISTED"
    | "SOLDOFFLINE"
    | "SOLDTOREALBRO"
    | "SOLDFROMLISTINGS"
    | "DRAFT";
};

type PropertyStats = {
    total: number;
    sold: number;
    active: number;
    unlisted: number;
};

export type UserApiItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    points: number;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    kyc: KycItem[];
    properties: PropertyItem[];
    propertyStats: PropertyStats;
};

async function getUsers(): Promise<UserColumnInterface[]> {
    const response = await api.get("/staff/users");
    const users: UserApiItem[] = response.data?.users ?? [];
    return users.map((user) => {
        const hasAnyVerifiedKyc = user.kyc?.some((k) => k.status === "VERIFIED") ?? false;
        return {
            id: user.id,
            username: `${user.firstName} ${user.lastName}`,
            email: user.email,
            isVerified: user.isEmailVerified,
            propertyListings: user.propertyStats,
            gems: user.points,
            kycStatus: hasAnyVerifiedKyc ? KYCStatus.Verified : KYCStatus.Pending,
            isBlocked: user.isBlocked,
        };
    });
}

export default function AllUsers() {
    const [data, setData] = useState<UserColumnInterface[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const load = async () => {
            try {
                const rows = await getUsers();
                setData(rows);
            } catch (error) {
                console.error("getRoleManagement error:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, []);
    return (
        <div>
            {isLoading ? <div>Loading...</div> : <AllUsersDataTable columns={allUsersColumns} data={data} />}
        </div>
    )
}
