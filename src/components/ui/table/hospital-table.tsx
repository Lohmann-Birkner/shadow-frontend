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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import { DataTablePagination } from "./data-table-pagination";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import {
    HospitalBillingColumns,
    HospitalDiagnosisColumns,
    HospitalProcedureColumns,
} from "./columns";
import { HospitalT } from "../../../../types";

interface CollapsibleDataTableProps {
    columns: ColumnDef<any, any>[];
    data: HospitalT[];
    pagination: boolean;
}

export function HospitalTable({
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
            <div className="rounded-md border">
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
                                            className="bg-white hover:bg-white"
                                            key={`expanded-${row.id}`}>
                                            <TableCell colSpan={columns.length}>
                                                {/* Add your expanded content here */}
                                                <>
                                                    {row.original.diagnosis
                                                        .length > 0 ? (
                                                        <div className="mb-5 px-3">
                                                            <h1 className="my-4 font-semibold">
                                                                Diagnosis:
                                                            </h1>

                                                            <DataTable
                                                                data={
                                                                    row.original
                                                                        .diagnosis
                                                                }
                                                                columns={HospitalDiagnosisColumns()}
                                                                pagination={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    ) : (
                                                        "No data"
                                                    )}
                                                    {row.original.billing
                                                        .length > 0 && (
                                                        <div className="mb-5 px-3">
                                                            <h1 className="my-5 font-semibold">
                                                                Billing:
                                                            </h1>

                                                            <DataTable
                                                                data={
                                                                    row.original
                                                                        .billing
                                                                }
                                                                columns={HospitalBillingColumns()}
                                                                pagination={
                                                                    false
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                    {row.original.procedure
                                                        .length > 0 && (
                                                        <div className="mb-5 px-3">
                                                            <h1 className="my-5 font-semibold">
                                                                Procedure:
                                                            </h1>

                                                            <DataTable
                                                                data={
                                                                    row.original
                                                                        .procedure
                                                                }
                                                                columns={HospitalProcedureColumns()}
                                                                pagination={
                                                                    false
                                                                }
                                                            />
                                                        </div>
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
            {pagination && <DataTablePagination table={table} />}
        </>
    );
}