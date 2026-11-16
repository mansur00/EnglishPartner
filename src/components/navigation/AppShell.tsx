import { Suspense } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        <Suspense fallback={<aside className="hidden md:flex w-64 border-r border-border bg-card" />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 pb-20 md:pb-8 max-w-7xl w-full mx-auto p-4 md:p-8">
          <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </div>
  );
}
