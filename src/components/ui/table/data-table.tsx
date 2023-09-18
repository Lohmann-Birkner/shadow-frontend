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
import {FormattedMessage, useIntl} from "react-intl";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    setSelectedItem?: (item: any) => void;
    selectedItem?: any;
    onRowClick?: (item: any) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setSelectedItem,
    selectedItem,
    onRowClick,
}: DataTableProps<TData, TValue>) {

    // const {formatMessage} = useIntl();
    // const aaa = columns.map((col)=>{
    //     // const cc = col.header;
    //     // const bb = {...col}
    //     // bb.header=formatMessage({id:cc?.toString()})
    //     // return bb;
    //     col.header=formatMessage({id:col.header?.toString()})
    //     return col;
    // })

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
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center">
                                    Keine Ergebnisse.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}
