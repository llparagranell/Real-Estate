import { AuthBanner } from "@/components/auth/authBanner";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 h-screen">
        <AuthBanner />
        {children}
    </div>;
}