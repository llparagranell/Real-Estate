import { Navbar } from "@/components/ui/navbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/appSidebar"
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full flex-col">
          <div className="shrink-0 border-b">
            <Navbar />
          </div>

          {/* Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar/>

            <main className="flex-1 overflow-auto p-6 bg-zinc-100">
              <SidebarTrigger />
              {children}
            </main>
          </div>

        </div>
      </SidebarProvider>
    </AdminAuthGuard>
  )
}