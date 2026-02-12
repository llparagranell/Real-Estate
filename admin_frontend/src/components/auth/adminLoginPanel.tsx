import { LoginCard } from "./loginCard";
import Image from "next/image";
export const AdminLoginPanel = () => {
    return (
        <div className="border-2 grid grid-rows-3">
            <div>Hello real bro</div>
            <LoginCard />
            <div className="flex justify-end">
                <Image src={"/authPageBuildingIcon.svg"} alt="auth page building icon" width={190} height={500} />
            </div>
        </div>
    );
};