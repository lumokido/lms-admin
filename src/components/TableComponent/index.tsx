/** @format */
"use client";
import React from "react";
import {
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import TBody from "./TBody";
import THeader from "./THeader";
import clsx from "clsx";

interface TableComponentProps<TData> {
  columns?: ColumnDef<any, any>[];
  data?: any[];
  model?: string;
  border?: boolean;
  isLoading?: boolean;
}

function TableComponent<TData>({
  columns = [],
  data = [],
  model,
  border = true,
  isLoading = false,
}: TableComponentProps<TData>) {
  const [columnSizing, setColumnSizing] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];
  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
    state: {
      sorting,
      columnSizing,
    },
    defaultColumn: {
      enableSorting: true,
      enableResizing: true,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
    onColumnSizingChange: setColumnSizing,
  });

  const tableData = table.getRowModel().rows || [];

  return (
    <div
      className={clsx(
        border ? "border rounded-xl" : "",
        "  bg-white shadow-sm overflow-hidden",
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <THeader headerGroups={table.getHeaderGroups()} />
          <TBody data={tableData} model={model} isLoading={isLoading} />
        </table>
      </div>
    </div>
  );
}

export default TableComponent;
