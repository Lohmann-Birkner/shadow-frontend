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

import {
  HospitalBillingColumns,
  HospitalDiagnosisColumns,
  RehabDiagnosisColumns,
  RehabPaymentColumns,
} from "./columns";

import { RehabT } from "../../../../types";
import { FormattedMessage } from "react-intl";

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
      <div className="max-h-[45rem] border-2 rounded-md h-[40rem] overflow-y-auto  ">
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
                    {/* <TableCell>
                                            <button>
                                                {expandedRows[row.id]
                                                    ? "Collapse"
                                                    : "Expand"}
                                            </button>
                                        </TableCell> */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="h-14" key={cell.id}>
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
                        {/* Add your expanded content here */}
                        <div className="lg:flex">
                          {row.original.payment.length > 0 ? (
                            <div className=" px-10 bg-neutral-100 w-3/4 mb-3  ">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Payment:
                              </TableCaption>

                              <DataTable
                                data={row.original.payment}
                                columns={RehabPaymentColumns()}
                                pagination={false}
                              />
                            </div>
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
                          {row.original.diagnosis.length > 0 && (
                            <div className=" px-10 bg-neutral-100 w-3/4 mb-3  ">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                              <FormattedMessage id="Diagnosis" />
:
                              </TableCaption>

                              <DataTable
                                data={row.original.diagnosis}
                                columns={RehabDiagnosisColumns()}
                                pagination={false}
                              />
                            </div>
                          )}
                        </div>
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
