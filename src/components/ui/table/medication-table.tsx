import {

  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  VisibilityState,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,

} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import { DataTablePagination } from "./data-table-pagination";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { MedicationPositionsColumns } from "./columns";
import { MedicationT } from "../../../../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@/components/ui/input";


interface CollapsibleDataTableProps {
    columns: ColumnDef<any, any>[];
    data: MedicationT[];
    pagination: boolean;
    className: string;
}

export function MedicationTable({
    columns,
    data,
    pagination,
}: CollapsibleDataTableProps) {

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { formatMessage } = useIntl();

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 12,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      sorting,
      columnFilters,
      globalFilter,
    },
  });


    // Function to toggle the expanded state of a row
    const toggleRowExpansion = (rowId: string) => {
        setExpandedRows((prevExpandedRows) => ({
            ...prevExpandedRows,
            [rowId]: !prevExpandedRows[rowId],
        }));
    };

    return (
      <>
        <div className="rounded-md max-h-[45rem] border-2 h-fit overflow-scroll">
          <div className="flex">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="m-2">
                    <FormattedMessage id="Columns" />
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          <FormattedMessage id={column.id} />
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <Input
                placeholder={formatMessage({
                  id: "Search_all_columns",
                })}
                className="p-2 font-lg shadow border border-block max-w-sm rounded-md m-2 h-2/3"
                onChange={(event) => setGlobalFilter(event.target.value)}
              />
            </div>
          </div>
          <Table className="h-full w-full overflow-scroll">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-slate-100 text-slate-950 pl-2"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      data-state={expandedRows[row.id] && "selected"}
                      onClick={() => toggleRowExpansion(row.id)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="h-14 pl-6" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                ))
              ) : null /* Handle no rows case */}
            </TableBody>
          </Table>
        </div>
        {pagination && <DataTablePagination table={table} />}
      </>
    );
}
