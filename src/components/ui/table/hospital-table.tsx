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
import {
  HospitalBillingColumns,
  HospitalDiagnosisColumns,
  HospitalProcedureColumns,
} from "./columns";
import { HospitalT } from "../../../../types";
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
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
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
      <div className="rounded-md h-full overflow-y-auto ">
        <div>
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
        </div>
        <Table>
          <TableHeader className=" text-slate-950 bg-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                      className="hover:bg-neutral-100 bg-neutral-100"
                      key={`expanded-${row.id}`}
                    >
                      <TableCell colSpan={columns.length}>
                        {/* Add your expanded content here */}
                        <>
                          {row.original.diagnosis.length > 0 ? (
                            <div className=" px-10 bg-neutral-100 w-1/2 ">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Diagnosis:
                              </TableCaption>

                              <DataTable
                                data={row.original.diagnosis}
                                columns={HospitalDiagnosisColumns()}
                                pagination={false}
                              />
                            </div>
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={columns.length}
                                className="h-14 text-center"
                              >
                                No results.
                              </TableCell>
                            </TableRow>
                          )}
                          {row.original.billing.length > 0 && (
                            <div className=" px-10 bg-neutral-100 w-1/2 ">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Billings:
                              </TableCaption>

                              <DataTable
                                data={row.original.billing}
                                columns={HospitalBillingColumns()}
                                pagination={false}
                              />
                            </div>
                          )}
                          {row.original.procedure.length > 0 && (
                            <div className=" px-10 bg-neutral-100 w-1/2 ">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Procedure:
                              </TableCaption>

                              <DataTable
                                data={row.original.procedure}
                                columns={HospitalProcedureColumns()}
                                pagination={false}
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
                  className="h-24 text-center"
                >
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
