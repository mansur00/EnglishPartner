import { Suspense } from "react";
import { Header, type HeaderUser } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { LoadingBox } from "@/components/shared/LoadingBox";

export function AppShell({ children, user }: { children: React.ReactNode; user?: HeaderUser | null }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header user={user} />
      <div className="flex flex-1">
        <Suspense fallback={<aside className="hidden md:flex w-sidebar border-r border-border bg-card sticky top-header h-below-header z-sidebar" />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 pb-20 md:pb-8 w-full min-w-0">
          <Suspense fallback={<LoadingBox />}>
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
