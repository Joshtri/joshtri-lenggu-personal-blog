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

interface Column {
  label: string;
  accessor: string | ((item: any, index: number) => React.ReactNode);
  center?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  actionsConfig?: any;
  pageSize?: number;
  skeletonRows?: number;
  enableInlineEdit?: boolean;
  onInlineEdit?: (updated: any) => void;
}

export default function DataTable({
  columns,
  data,
  isLoading = false,
  actionsConfig,
  pageSize = 10,
  skeletonRows = 5,
  enableInlineEdit = false,
  onInlineEdit,
}: DataTableProps) {
  const [page, setPage] = useState(1);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, any>>({});

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handleCellChange = (name: string, value: string) => {
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = () => {
    if (onInlineEdit && editingRowId) {
      onInlineEdit(editingData);
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
                const isEditing = enableInlineEdit && editingRowId === item.id;
                return (
                  <TableRow
                    key={item.id || i}
                    onClick={(e) => {
                      if (enableInlineEdit) {
                        const isActionColumn =
                          (e.target as HTMLElement).closest("td")?.dataset
                            .type === "actions";
                        if (isActionColumn) return;

                        setEditingRowId(item.id);
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
                            name={col.accessor}
                            value={editingData[col.accessor] ?? ""}
                            onChange={(e) =>
                              handleCellChange(
                                col.accessor as string,
                                e.target.value
                              )
                            }
                            className="w-full border px-2 py-1 rounded text-sm"
                          />
                        ) : typeof col.accessor === "function" ? (
                          col.accessor(item, i)
                        ) : (
                          item[col.accessor]
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
                                ? () => actionsConfig.onView(item)
                                : undefined
                            }
                            editAction={
                              actionsConfig.onEdit
                                ? () => actionsConfig.onEdit(item)
                                : undefined
                            }
                            deleteAction={
                              actionsConfig.onDelete
                                ? actionsConfig.onDelete(item)
                                : undefined
                            }
                            customActions={
                              actionsConfig.customActions?.(item) ?? []
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
