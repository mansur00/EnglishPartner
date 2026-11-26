import { AppShell } from "@/components/navigation/AppShell";
import { SessionIsolationProvider } from "@/components/auth/SessionIsolationProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionIsolationProvider>
      <AppShell>{children}</AppShell>
    </SessionIsolationProvider>
  );
}
