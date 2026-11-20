import * as React from "react";

export function LoadingBox({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="p-8 text-center text-meta text-muted-foreground">
      {message}
    </div>
  );
}
