import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    VisibilityState,
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
import { MedaidPositionsColumns } from "./columns";
import { MedaidT } from "../../../../types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedMessage } from "react-intl";

interface CollapsibleDataTableProps {
    columns: ColumnDef<any, any>[];
    data: MedaidT[];
    pagination: boolean;
}

export function MadaidTable({
    columns,
    data,
    pagination,
}: CollapsibleDataTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {}
    );
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});

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
        state: {
            columnVisibility,
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
            <div className="max-h-[45rem] border-2 rounded-md h-[40rem] overflow-y-auto ">
                {/* <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="m-2">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                      className="capitalize "
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="bg-slate-100 text-slate-950 ">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
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
                                <>
                                    <TableRow
                                        key={row.id}
                                        className="cursor-pointer"
                                        data-state={
                                            expandedRows[row.id] && "selected"
                                        }
                                        onClick={() =>
                                            toggleRowExpansion(row.id)
                                        }>
                                        {/* <TableCell>
                                            <button>
                                                {expandedRows[row.id]
                                                    ? "Collapse"
                                                    : "Expand"}
                                            </button>
                                        </TableCell> */}
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                className="h-14"
                                                key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {expandedRows[row.id] && (
                                        <TableRow
                                            className="hover:bg-neutral-100 bg-neutral-100"
                                            key={`expanded-${row.id}`}>
                                            <TableCell colSpan={columns.length}>
                                                {/* Add your expanded content here */}
                                                <>
                                                    {row.original.positions
                                                        .length > 0 ? (
                                                        <div className="px-10 bg-neutral-100 mb-3  ">
                                                            <TableCaption className="my-4 font-semibold text-slate-950">
                                                                Positions:
                                                            </TableCaption>
                                                            <div className="flex flex-col space-y-5">
                                                                <DataTable
                                                                    data={
                                                                        row
                                                                            .original
                                                                            .positions
                                                                    }
                                                                    columns={MedaidPositionsColumns()}
                                                                    pagination={
                                                                        false
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={
                                                                    columns.length
                                                                }
                                                                className="h-14 text-center">
                                                                <FormattedMessage id="No_results" />
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
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
