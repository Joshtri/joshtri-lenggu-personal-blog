import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { ActionsButton } from "@/components/common/ActionsButton";

// Define base data item type
export type DataItem = Record<string, unknown>;

// Define column type with generics
export interface Column<T extends DataItem = DataItem> {
  label: string;
  accessor: keyof T | ((item: T, index: number) => React.ReactNode);
  center?: boolean;
}

// Define action configuration type
export interface ActionConfig<T extends DataItem = DataItem> {
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  customActions?: (item: T) => Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }>;
}

// Define props with generics
interface DataTableProps<T extends DataItem = DataItem> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  actionsConfig?: ActionConfig<T>;
  pageSize?: number;
  skeletonRows?: number;
  enableInlineEdit?: boolean;
  onInlineEdit?: (updated: T) => void;
}

export default function DataTable<T extends DataItem = DataItem>({
  columns,
  data,
  isLoading = false,
  actionsConfig,
  pageSize = 10,
  skeletonRows = 5,
  enableInlineEdit = false,
  onInlineEdit,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, unknown>>({});

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleCellChange = (name: string, value: unknown) => {
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (onInlineEdit && editingRowId) {
      onInlineEdit(editingData as T);
      setEditingRowId(null);
    }
  };

  return (
    <div className="rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i} className={col.center ? "text-center" : ""}>
                {col.label}
              </TableHead>
            ))}
            {actionsConfig && (
              <TableHead className="text-center">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                  {actionsConfig && (
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            : paginated.map((item, i) => {
                // Type guard to check if item has an id property
                const itemId = (item as { id?: string }).id;
                const isEditing = enableInlineEdit && itemId && editingRowId === itemId;
                
                return (
                  <TableRow
                    key={itemId || `row-${i}`}
                    onClick={(e) => {
                      if (enableInlineEdit && itemId) {
                        const isActionColumn =
                          (e.target as HTMLElement).closest("td")?.dataset
                            .type === "actions";
                        if (isActionColumn) return;

                        setEditingRowId(itemId);
                        setEditingData(item);
                      }
                    }}
                    className={
                      enableInlineEdit ? "cursor-pointer hover:bg-muted/30" : ""
                    }
                  >
                    {columns.map((col, j) => (
                      <TableCell
                        key={j}
                        className={col.center ? "text-center" : ""}
                      >
                        {isEditing && typeof col.accessor === "string" ? (
                          <input
                            name={String(col.accessor)}
                            value={String(editingData[String(col.accessor)] ?? "")}
                            onChange={(e) =>
                              handleCellChange(
                                String(col.accessor),
                                e.target.value
                              )
                            }
                            className="w-full border px-2 py-1 rounded text-sm"
                          />
                        ) : typeof col.accessor === "function" ? (
                          col.accessor(item, i)
                        ) : (
                          // Safely access nested property
                          String(item[col.accessor as keyof T] ?? "")
                        )}
                      </TableCell>
                    ))}
                    {actionsConfig && (
                      <TableCell className="text-center" data-type="actions">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit();
                              }}
                            >
                              Simpan
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRowId(null);
                              }}
                            >
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <ActionsButton
                            viewAction={
                              actionsConfig.onView
                                ? () => actionsConfig.onView?.(item)
                                : undefined
                            }
                            editAction={
                              actionsConfig.onEdit
                                ? () => actionsConfig.onEdit?.(item)
                                : undefined
                            }
                            deleteAction={
                              actionsConfig.onDelete
                                ? {
                                    onConfirm: () => actionsConfig.onDelete?.(item)
                                  }
                                : undefined
                            }
                            customActions={
                              actionsConfig.customActions?.(item) || []
                            }
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-between p-4 text-sm text-muted-foreground">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}