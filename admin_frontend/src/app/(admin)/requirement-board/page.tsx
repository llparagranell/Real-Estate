import { RequirementBoardTableInterface, columns as requirementColumns } from "@/components/requirementBoard/requirementColumns";
// import FinancialsDataTable from "@components/Financials/financialsDatatable"
import { RequirementDataTable } from "@/components/requirementBoard/requirementDataTable";

async function getRequirements(): Promise<RequirementBoardTableInterface[]> {
    // const response = await axios.get("https://api.example.com/role-management")
    // const data = await response.json()
    // return data
    return [

        {
            userName: "John Doe",
            email: "john.doe@example.com",
            location: "123 Main St, Ludhiana, Punjab",
            amount: "122200",
            status: "Active",
        },
        {
            userName: "Amanpreet Singh",
            email: "aman.singh@gmail.com",
            location: "45 Model Town, Jalandhar, Punjab",
            amount: "84500",
            status: "Completed",
        },
        {
            userName: "Ritika Sharma",
            email: "ritika.sharma@outlook.com",
            location: "78 Sector 22, Chandigarh",
            amount: "45200",
            status: "Unseen",
        },
        {
            userName: "Harpreet Kaur",
            email: "harpreet.kaur@yahoo.com",
            location: "12 Urban Estate, Patiala",
            amount: "98000",
            status: "Active",
        },
        {
            userName: "Karan Malhotra",
            email: "karan.malhotra@gmail.com",
            location: "9 Civil Lines, Amritsar",
            amount: "156000",
            status: "Completed",
        },
        {
            userName: "Simran Gill",
            email: "simran.gill@icloud.com",
            location: "33 Green Avenue, Mohali",
            amount: "67000",
            status: "Unseen",
        },
        {
            userName: "Rohit Verma",
            email: "rohit.verma@gmail.com",
            location: "101 GT Road, Phagwara",
            amount: "73000",
            status: "Active",
        },
        {
            userName: "Neha Bansal",
            email: "neha.bansal@protonmail.com",
            location: "5 Rose Garden, Chandigarh",
            amount: "111000",
            status: "Completed",
        },
        {
            userName: "Manav Arora",
            email: "manav.arora@gmail.com",
            location: "17 Defence Colony, Bathinda",
            amount: "54000",
            status: "Unseen",
        },
        {
            userName: "Pooja Mehta",
            email: "pooja.mehta@gmail.com",
            location: "88 Shastri Nagar, Hoshiarpur",
            amount: "89000",
            status: "Active",
        },
    ]
}
export default async function RequirementBoardPage() {
    const data = await getRequirements();
    return (
        <div className="mt-4">
            <RequirementDataTable columns={requirementColumns} data={data} />
        </div>
    )
}