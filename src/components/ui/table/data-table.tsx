import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnSizingColumnDef,
  SortingState,
  getSortedRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { DataTablePagination } from "./data-table-pagination";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any;
  setSelectedItem?: (item: any) => void;
  selectedItem?: any;
  onRowClick?: (item: any) => void;
  pagination: boolean;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setSelectedItem,
  selectedItem,
  onRowClick,
  pagination,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      Secondary_diagnosis: false,
      Type_diagnosis: false,
      Localization_diagnosis: false,
      Severity_diagnosis: false,
    });
  const onClickOpenColumns = () => {
    setColumnVisibility({
      Secondary_diagnosis: !columnVisibility.Secondary_diagnosis,
      Type_diagnosis: !columnVisibility.Type_diagnosis,
      Localization_diagnosis: !columnVisibility.Localization_diagnosis,
      Severity_diagnosis: !columnVisibility.Severity_diagnosis,
    });
  };
  const table = useReactTable({
    data,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
    enableColumnResizing:
      columns[0].id !== "ins_id" &&
      columns[0].id !== "related_patient_id" &&
      true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  let checkIfcolumnNeedToBeShown =
    columns[0].header == "Datum Diagnose" ||
    columns[0].header == "Date diagnosis";

  return (
    <>
      {checkIfcolumnNeedToBeShown && (
        <Button onClick={onClickOpenColumns}>expand</Button>
      )}

      <div
        className="rounded-md border-2 overflow-auto"
        style={{
          height: columns[0].id == "related_patient_id" ? "65vh" : "none",
        }}
      >
        <Table
          // style={{
          //   width: table.getTotalSize(),
          // }}
          className={`w-full border-collapse ${
            columns[0].id !== "ins_id" 
              ? `w-${table.getTotalSize()}`
              : ""
          }`}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className={cn("bg-slate-100 text-slate-950 h-15 border-b-2 py-2",
                      columns[0].id=="ins_id"&&"font-bold text-base"
                      )}
                      key={header.id}
                      style={{ position: "relative", width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {columns[0].header !== "Versichertennummer" &&
                        columns[0].header !== "Insurance Number" &&
                        header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`absolute top-0 right-0 h-full w-0.5 bg-opacity-10 bg-black cursor-col-resize select-none touch-none ${
                              header.column.getIsResizing() ? "opacity-100" : ""
                            }`}
                          ></div>
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="overflow-hidden"
                  key={row.id}
                  onClick={() => {
                    onRowClick && onRowClick(row.original);
                  }}

                  // data-state={
                  //     row.original === selectedItem &&
                  //     "selected"
                  // }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      id={cell.id}
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <FormattedMessage id="No_results" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </>
  );
}
