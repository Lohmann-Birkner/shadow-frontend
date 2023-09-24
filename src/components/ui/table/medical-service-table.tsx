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
import React from "react";
import { FormattedMessage } from "react-intl";
import { DiagsT, OpsT } from "../../../../types";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedItem?: (item: any) => void;
    selectedItem?: any;
    onRowClick?: (item: any) => void;
}

export function MedicalServiceTable<TData, TValue>({
    columns,
    data,
    setSelectedItem,
    selectedItem,
    onRowClick,
}: DataTableProps<TData, TValue>) {
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

    return (
        <>
            <div className="rounded-md border mt-5">
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
                            table.getRowModel().rows.map((row: any) => (
                                <>
                                    <TableRow
                                        className="overflow-hidden"
                                        key={row.id}
                                        onClick={() => {
                                            onRowClick &&
                                                onRowClick(row.original);
                                        }}
                                        // data-state={
                                        //     row.original === selectedItem &&
                                        //     "selected"
                                        // }
                                    >
                                        {row
                                            .getVisibleCells()
                                            .map((cell: any) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                    </TableRow>
                                    {/* Add a nested table for 'diags' */}
                                    <h1 className="text-md font-semibold p-4 pb-0">
                                        Diags:
                                    </h1>
                                    <TableRow className="hover:bg-white">
                                        <TableCell
                                            className="w-[50%]"
                                            colSpan={columns.length}>
                                            <NestedDiagsTable
                                                diags={row.original.diags}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    {/* Add a nested table for 'ops' */}
                                    <h1 className="text-md font-semibold p-4 pb-0">
                                        Ops:
                                    </h1>
                                    <TableRow className="hover:bg-white">
                                        <TableCell colSpan={columns.length}>
                                            <NestedOpsTable
                                                ops={row.original.ops}
                                            />
                                        </TableCell>
                                    </TableRow>
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
            {/* <DataTablePagination table={table} /> */}
        </>
    );
}

interface NestedDiagsTableProps {
    diags: DiagsT[];
}

interface NestedOpsTableProps {
    ops: OpsT[];
}

export function NestedDiagsTable({ diags }: NestedDiagsTableProps) {
    return (
        <Table className="w-[50%]">
            <TableHeader>
                <TableRow className="border-b bg-slate-50">
                    <TableHead>
                        <FormattedMessage id="Number_ICD" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="ICD" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="Quality_ICD" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="Localization_ICD" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {diags.map((diag, index) => (
                    <TableRow key={index}>
                        <TableCell>{diag.Number_ICD}</TableCell>
                        <TableCell>{diag.ICD}</TableCell>
                        <TableCell>{diag.Quality_ICD}</TableCell>
                        <TableCell>{diag.Localization_ICD}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function NestedOpsTable({ ops }: NestedOpsTableProps) {
    return (
        <Table className="w-[50%]">
            <TableHeader>
                <TableRow className="border-b bg-slate-50">
                    <TableHead>
                        <FormattedMessage id="Quarter" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="Number_procedure" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="Identifier_operation" />
                    </TableHead>
                    <TableHead>
                        <FormattedMessage id="Localization_procedure" />
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ops.map((op, index) => (
                    <TableRow className="border-b" key={index}>
                        <TableCell>{op.Quarter}</TableCell>
                        <TableCell>{op.Number_procedure}</TableCell>
                        <TableCell>{op.Identifier_operation}</TableCell>
                        <TableCell>{op.Localization_procedure}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
