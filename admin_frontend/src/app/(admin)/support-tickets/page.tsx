import { columns as ticketColumns } from "@/components/supportTicket/ticketColumns";
import { TicketDataTable } from "@/components/supportTicket/ticketDataTable";
import { TicketTableInterface } from "@/components/supportTicket/ticketColumns";


async function getTickets(): Promise<TicketTableInterface[]> {
        return [
            {
                userName: "John Doe",
                email: "john.doe@example.com",
                description: "I have a problem my account, Its not working properly",
                date: "2021-01-01",
                status: "Active",
            },
            {
                userName: "Janumani",
                email: "jane.doe@example.com",
                description: "My Property is not listed even after 2 days",
                date: "2021-01-01",
                status: "Resolved",
            },
            {
                userName: "Raman",
                email: "john.doe@example.com",
                description: "I dont remember my password please help me",
                date: "2021-01-01",
                status: "Active",
            },
            {
                userName: "Ananya",
                email: "jane.doe@example.com",
                description: "Accidently forgot my password",
                date: "2021-01-01",
                status: "Unseen",
            },
    ]
}

export default async function SupportTicketsPage() {
    const data = await getTickets();
    return (
        <div>
            <TicketDataTable columns={ticketColumns} data={data} />
        </div>
    )
}