"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: string; // Tailwind spacing: "p-4", "px-6", etc.
  gap?: string; // Tailwind spacing between elements: "space-y-4"
  maxWidth?: string; // Tailwind max-width: "max-w-7xl", etc.
  responsive?: boolean;
}

export const Container = ({
  children,
  className,
  padding = "p-4",
  gap = "space-y-6",
  maxWidth,
  responsive = true,
  ...props
}: ContainerProps) => {
  return (
    <div
      className={cn(
        padding,
        gap,
        responsive && "mx-auto w-full",
        maxWidth,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
