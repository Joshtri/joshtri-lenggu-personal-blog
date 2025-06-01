"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ContentSkeletonProps {
  variant?: "detail" | "card"; // 🔄 detail (default) atau grid/card
  withImage?: boolean;
  lines?: number;
  count?: number; // untuk grid/card, jumlah card yang ditampilkan
}

export function ContentSkeleton({
  variant = "detail",
  withImage = true,
  lines = 3,
  count = 6,
}: ContentSkeletonProps) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: variant === "detail"
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
      {withImage && <Skeleton className="h-80 w-full rounded-md" />}
    </div>
  );
}
