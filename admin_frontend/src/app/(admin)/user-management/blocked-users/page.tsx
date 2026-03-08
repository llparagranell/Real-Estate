import { BlockedUsersDataTable } from "@/components/user_management/blockedUsersDataTable";
import { BlockedUserColumnInterface, BlockedUsersColumns } from "@/components/user_management/blockedUsersColumns";

export type UserApiItem = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isBlocked: boolean;
    blockedBy: string;
    blockedOn: string;
};

async function getUsers(): Promise<BlockedUserColumnInterface[]> {
        // const response = await fetch("https://api.example.com/users")
        // const data = await response.json()
        // return data;
    return [
        {
            username: "Emilysadas White",
            email: "ahhgdjsjh@gmail.com",
            role: "User",
            blockedOn: "2021-01-01",
            blockedBy: "Rajun Kumar",
            isBlocked: false,
        },
        
    ]
};

export default async function AllUsersPage() {
    const data = await getUsers();
    return (
        <div>
            <BlockedUsersDataTable columns={BlockedUsersColumns} data={data} />
        </div>
    );
};
 