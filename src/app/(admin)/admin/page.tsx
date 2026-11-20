import { Suspense } from "react";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { LoadingBox } from "@/components/shared/LoadingBox";

export default function AdminPage() {
  return (
    <Suspense fallback={<LoadingBox message="Loading Admin Console..." />}>
      <AdminDashboardClient />
    </Suspense>
  );
}
