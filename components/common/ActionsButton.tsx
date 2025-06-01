"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { DialogTrigger } from "@/components/ui/dialog";
import React, { ReactNode } from "react";

type ActionItem =
  | {
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      disabled?: boolean;
      variant?: "default" | "destructive";
    }
  | ReactNode; // allows custom JSX like DialogTrigger

interface ActionsButtonProps {
  viewAction?: () => void;
  editAction?: (() => void) | ReactNode;
  deleteAction?: {
    message?: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
  };
  customActions?: ActionItem[];
  iconOnly?: boolean; // for icon-only trigger
}

export function ActionsButton({
  viewAction,
  editAction,
  deleteAction,
  customActions = [],
  iconOnly = true,
}: ActionsButtonProps) {
  const hasActions =
    viewAction || editAction || deleteAction || customActions.length > 0;
  if (!hasActions) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={iconOnly ? "icon" : "sm"}
          className="gap-1"
        >
          <MoreVertical className="h-4 w-4" />
          {!iconOnly && <span>Aksi</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewAction && (
          <DropdownMenuItem onClick={viewAction}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat
          </DropdownMenuItem>
        )}

        {editAction &&
          (typeof editAction === "function" ? (
            <DropdownMenuItem onClick={editAction}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          ) : (
            <div className="px-2 py-1">{editAction}</div>
          ))}

        {customActions.map((action, idx) =>
          React.isValidElement(action) ? (
            <div key={`custom-${idx}`} className="px-2 py-1">
              {action}
            </div>
          ) : (
            <DropdownMenuItem
              key={`custom-${idx}`}
              onClick={(action as { onClick: () => void }).onClick}
              disabled={(action as { disabled?: boolean }).disabled}
              className={
                (action as { variant?: string }).variant === "destructive" ? "text-red-600 focus:text-red-600" : ""
              }
            >
              {(action as { icon?: React.ReactNode }).icon && <span className="mr-2 h-4 w-4">{(action as { icon?: React.ReactNode }).icon}</span>}
              {(action as { label: string }).label}
            </DropdownMenuItem>
          )
        )}

        {deleteAction && (
          <ConfirmationDialog
            trigger={
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DialogTrigger>
            }
            title="Hapus Data"
            message={deleteAction.message ?? "Yakin ingin menghapus data ini?"}
            confirmLabel={deleteAction.confirmLabel ?? "Hapus"}
            confirmVariant="destructive"
            icon={<Trash2 className="text-red-600" />}
            onConfirm={deleteAction.onConfirm}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
