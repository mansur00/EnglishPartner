import { Header } from "@/components/navigation/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 w-full min-w-0">
        {children}
      </main>
    </div>
  );
}

