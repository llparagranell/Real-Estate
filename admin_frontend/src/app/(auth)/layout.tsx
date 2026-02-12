import { AuthBanner } from "@/components/auth/authLeftBanner";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-2 h-screen overflow-hidden">
        <AuthBanner />
        {children}
    </div>;
}