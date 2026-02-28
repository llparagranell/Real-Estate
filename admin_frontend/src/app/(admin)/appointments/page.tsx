import { columns as appointmentColumns } from "@/components/appointments/appointmentColumns";
import { AppointmentsDataTable } from "@/components/appointments/appointmentDataTable";
import AppointmentsTopBar from "@/components/appointments/appointmentsTopBar";
import { AppointmentTableInterface } from "@/components/appointments/appointmentColumns";

async function getAppointments(): Promise<AppointmentTableInterface[]> {
    // const response = await axios.get("https://api.example.com/role-management")
    // const data = await response.json()
    // return data
    return [
        {
            userName: "Uday Kumar",
            purpose: "3 BHK Flat in Arera Colony",
            staffHandler: "Rajun Kumar",
            details: "12th Feb, 2025",
            status: "Completed",
        },
        {
            userName: "Ankit Sharma",
            purpose: "2 BHK Apartment in MP Nagar",
            staffHandler: "Priya Verma",
            details: "15th Feb, 2025",
            status: "Absent",
        },
        {
            userName: "Rohit Singh",
            purpose: "Office Space in Zone 1",
            staffHandler: "Amit Tiwari",
            details: "18th Feb, 2025",
            status: "Cancelled",
        },
        {
            userName: "Sneha Patel",
            purpose: "Villa in Kolar Road",
            staffHandler: "Rajun Kumar",
            details: "20th Feb, 2025",
            status: "Completed",
        },
        {
            userName: "Vikram Joshi",
            purpose: "1 BHK Rental in Govindpura",
            staffHandler: "Neha Singh",
            details: "22nd Feb, 2025",
            status: "Absent",
        },
        {
            userName: "Megha Rao",
            purpose: "Commercial Shop in New Market",
            staffHandler: "Amit Tiwari",
            details: "24th Feb, 2025",
            status: "Completed",
        },
        {
            userName: "Arjun Mehta",
            purpose: "Plot Purchase in Hoshangabad Road",
            staffHandler: "Priya Verma",
            details: "26th Feb, 2025",
            status: "Cancelled",
        },
        {
            userName: "Kunal Deshmukh",
            purpose: "2 BHK Flat in Bawadia Kalan",
            staffHandler: "Neha Singh",
            details: "28th Feb, 2025",
            status: "Completed",
        },
    ]
}
export default async function AppointmentsPage() {
    const data = await getAppointments();
    return (
        <div className="mt-4">
            <AppointmentsTopBar />
            <AppointmentsDataTable columns={appointmentColumns} data={data} />
        </div>
    )
}