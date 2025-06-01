"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatusTooltipWrapperProps {
  status?: boolean; // opsional, untuk kompatibilitas boolean
  trueText?: string;
  falseText?: string;
  tooltipText?: string; // digunakan jika bukan boolean
  children?: ReactNode;
  className?: string;
}

export function StatusTooltipWrapper({
  status,
  trueText = "Aktif",
  falseText = "Tidak aktif",
  tooltipText,
  children,
  className,
}: StatusTooltipWrapperProps) {
  const content = tooltipText ?? (status ? trueText : falseText);
  const icon =
    children ??
    (status ? (
      <CheckCircle className={cn("text-green-600 w-5 h-5", className)} />
    ) : (
      <XCircle className={cn("text-red-500 w-5 h-5", className)} />
    ));

  return (
    <Tooltip>
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
