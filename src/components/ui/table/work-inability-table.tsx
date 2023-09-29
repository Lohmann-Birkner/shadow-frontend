import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
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
import { WorkInabilityDiagnosisColumns } from "./columns";
import { WorkInabilityT } from "../../../../types";

interface CollapsibleDataTableProps {
    columns: ColumnDef<any, any>[];
    data: WorkInabilityT["payments"];
    pagination: boolean;
}

export function WorkInabilityTable({
    columns,
    data,
    pagination,
}: CollapsibleDataTableProps) {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
        {}
    );

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
            <div className="rounded-md max-h-[45rem] border-2 h-[40rem] overflow-y-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                    {expandedRows[row.id] && (
                                        <TableRow
                                            className="hover:bg-neutral-100 bg-neutral-100 "
                                            key={`expanded-${row.id}`}>
                                            <TableCell colSpan={columns.length}>
                                                {/* Add your expanded content here */}
                                                <>
                                                    {row.original.diagnosis
                                                        .length > 0 ? (
                                                            <div className=" px-10 bg-neutral-100 w-9/10 mb-3      ">
                                                            <TableCaption className="my-2 font-semibold text-slate-950">
                                                              Diagnosis:
                                                            </TableCaption>

                                                            <DataTable
                                                                data={
                                                                    row.original
                                                                        .diagnosis
                                                                }
                                                                columns={WorkInabilityDiagnosisColumns()}
                                                                pagination={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        "No data"
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {/* {pagination && <DataTablePagination table={table} />} */}
        </>
    );
}
