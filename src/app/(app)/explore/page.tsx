import { Suspense } from "react";
import { ExploreClient } from "@/components/discovery/ExploreClient";

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreClient />
    </Suspense>
  );
}
