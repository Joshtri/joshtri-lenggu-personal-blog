"use client";

import { useState, useMemo } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, LayoutGrid } from "lucide-react";
import DataTable from "./datatable";
import CardGrid from "./cardgrid";
import SearchBar from "@/components/ui/search-bar";

// Define a generic type for the data items
export type DataItem = Record<string, unknown>;

export interface Column<T extends DataItem = DataItem> {
  label: string;
  accessor: keyof T | ((item: T, index: number) => React.ReactNode);
  center?: boolean;
}

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

interface DataViewSwitcherProps<T extends DataItem = DataItem> {
  view?: "table" | "grid";
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  actionsConfig?: ActionConfig<T>;
  pageSize?: number;
  skeletonRows?: number;
  enableInlineEdit?: boolean;
  onInlineEdit?: (updated: T) => void;
}

export default function DataViewSwitcher({
  view = "table",
  columns,
  data,
  isLoading = false,
  actionsConfig,
  pageSize = 10,
  skeletonRows = 5,
  enableInlineEdit = false,
  onInlineEdit,
}: DataViewSwitcherProps) {
  const [currentView, setCurrentView] = useState<"table" | "grid">(view);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return data;

    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(keyword)
      )
    );
  }, [search, data]);

  return (
    <div className="space-y-4">
      {/* Toggle View */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={currentView}
          onValueChange={(val) =>
            val && setCurrentView(val as "table" | "grid")
          }
        >
          <ToggleGroupItem value="table" aria-label="Tabel">
            <Table className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* View Content */}
      {currentView === "table" ? (
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          actionsConfig={actionsConfig}
          pageSize={pageSize}
          skeletonRows={skeletonRows}
          enableInlineEdit={enableInlineEdit}
          onInlineEdit={onInlineEdit}
        />
      ) : (
        <CardGrid
          data={filteredData}
          columns={columns}
          isLoading={isLoading}
          actionsConfig={actionsConfig}
        />
      )}
    </div>
  );
}
