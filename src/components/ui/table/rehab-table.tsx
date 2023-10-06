import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
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

import {
  HospitalBillingColumns,
  HospitalDiagnosisColumns,
  RehabDiagnosisColumns,
  RehabPaymentColumns,
} from "./columns";

import { RehabT } from "../../../../types";
import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CollapsibleDataTableProps {
  columns: ColumnDef<any, any>[];
  data: RehabT[];
  pagination: boolean;
}

export function RehabTable({
  columns,
  data,
  pagination,
}: CollapsibleDataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
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
      <div className="max-h-[45rem] border-2 rounded-md h-[40rem] overflow-y-auto  ">
        <div>
          <Input
            placeholder={formatMessage({
              id: "Search_all_columns",
            })}
            className="p-2 font-lg shadow border border-block  max-w-sm rounded-md m-2 h-2/3"
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-slate-100 text-slate-950 "
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
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
                  {expandedRows[row.id] && (
                    <TableRow
                      className="hover:bg-neutral-100 bg-neutral-100 "
                      key={`expanded-${row.id}`}
                    >
                      <TableCell colSpan={columns.length}>
                        <Tabs>
                          <TabsList className=" font-semibold text-slate-950 bg-neutral-100 rounded-md">
                            <TabsTrigger
                              value="Diagnosis"
                              className="bg-neutral-100 "
                            >
                              <FormattedMessage id="Diagnosis" />
                            </TabsTrigger>
                            <TabsTrigger
                              value="Payment"
                              className="bg-neutral-100"
                            >
                              <FormattedMessage id="Payment" />
                            </TabsTrigger>
                          </TabsList>
                          {/* Add your expanded content here */}

                          {row.original.payment.length > 0 ? (
                            <TabsContent value="Diagnosis" className="border-0">
                              <DataTable
                                data={row.original.payment}
                                columns={RehabPaymentColumns()}
                                pagination={false}
                              />
                            </TabsContent>
                          ) : (
                            <TabsContent value="Diagnosis" className="border-0">
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length}
                                  className="h-24 text-center"
                                >
                                  <FormattedMessage id="No_results" />
                                </TableCell>
                              </TableRow>
                            </TabsContent>
                          )}
                          {row.original.diagnosis.length > 0 && (
                            <TabsContent value="Payment" className="border-0">
                           

                              <DataTable
                                data={row.original.diagnosis}
                                columns={RehabDiagnosisColumns()}
                                pagination={false}
                              />
                            </TabsContent>
                            
                          )}
                        </Tabs>
                      </TableCell>
                    </TableRow>
                  )}
                </>
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
