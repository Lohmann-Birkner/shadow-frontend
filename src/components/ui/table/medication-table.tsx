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
import { DiagsT, OpsT, PositionsT } from "../../../../types";
import { DataTable } from "./data-table";
import { PositionsColumns } from "./columns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedItem?: (item: any) => void;
    selectedItem?: any;
    onRowClick?: (item: any) => void;
}

export function MedicationsTable<TData, TValue>({
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

                                    <h1 className="text-md font-semibold p-4 pb-0">
                                        Positions:
                                    </h1>
                                    <TableRow className="hover:bg-white">
                                        <TableCell
                                            className="w-[50%]"
                                            colSpan={columns.length}>
                                            <DataTable
                                                pagination={false}
                                                columns={PositionsColumns()}
                                                data={row.original.positions}
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
