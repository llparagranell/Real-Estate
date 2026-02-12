import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const LoginCard = () => {
    return (
        <div className="flex items-center justify-center ">
            <div className="w-xl">
                <h1 className="text-center text-[24px] font-semibold">Sign In</h1>
                <div className="flex flex-col gap-3 mt-12 ">
                    <Input type="email" placeholder="Enter Email / number" className="py-5" />
                    <Input type="password" placeholder="Enter password" className="py-5" />
                    <Button className="rounded-3xl py-6 text-[16px]">Sign in</Button>
                </div>
                <div className="text-center text-[15px] font-bold mt-4 text-blue-600">
                    <Link href="/forgot-password" >Reset your password</Link>
                </div>
            </div>
        </div>
    );
};