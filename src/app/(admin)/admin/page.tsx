import { Suspense } from "react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-meta text-muted-foreground">Loading Admin Console...</div>}>
      <AdminDashboardClient />
    </Suspense>
  );
}
