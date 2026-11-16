import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--ecp-canvas)] text-[var(--ecp-text-primary)]">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pb-20 md:pb-8 max-w-7xl w-full mx-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

