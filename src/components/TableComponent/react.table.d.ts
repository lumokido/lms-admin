import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: "left" | "center" | "right";
    exportHeader?: string;
    excludeFromExport?: boolean;
    exportValue?: (row: TData) => unknown;
  }
}
