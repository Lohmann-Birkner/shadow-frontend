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
import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [tab, setTab] = useState("Diagnosis");
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
      <div className="rounded-md h-full overflow-y-auto border-2">
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
                        className="capitalize "
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
              className="p-2 font-lg shadow border border-block  max-w-sm rounded-md m-2 h-2/3"
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className=" text-slate-950 bg-slate-100 h-20"
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
                      className="hover:bg-neutral-100 bg-neutral-100"
                      key={`expanded-${row.id}`}
                    >
                      <TableCell colSpan={columns.length}>
                        <Tabs value={tab}
                        onValueChange={setTab}
                        >
                          <TabsList className=" font-semibold text-slate-950 bg-neutral-100 rounded-md">
                            <TabsTrigger
                              value="Diagnosis"
                              className="bg-neutral-100 "
                            >
                              <FormattedMessage id="Diagnosis" />
                            </TabsTrigger>
                            <TabsTrigger
                              value="Billings"
                              className="bg-neutral-100"
                            >
                              <FormattedMessage id="Billings" />
                            </TabsTrigger>
                            <TabsTrigger
                              value="Procedures"
                              className="bg-neutral-100"
                            >
                              <FormattedMessage id="Procedures" />
                            </TabsTrigger>
                          </TabsList>
                          {/* Add your expanded content here */}
                          {row.original.diagnosis.length > 0 ? (
                            <TabsContent value="Diagnosis" className="text-center border-0 w-fit">
                              <DataTable
                                data={row.original.diagnosis}
                                columns={HospitalDiagnosisColumns()}
                                pagination={false}
                                className="w-1/3"
                              />
                            </TabsContent>
                          ) : (
                            <TabsContent value="Diagnosis" className="text-center border-0 w-fit">
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length}
                                  className="h-14 text-center"
                                >
                                  <FormattedMessage id="No_results" />
                                </TableCell>
                              </TableRow>
                            </TabsContent>
                          )}
                          {row.original.billing.length > 0 && (
                            <TabsContent value="Billings" className="text-center border-0 w-fit">
                              <DataTable
                                data={row.original.billing}
                                columns={HospitalBillingColumns()}
                                pagination={false}
                              />
                            </TabsContent>
                          )}
                          {row.original.procedure.length > 0 && (
                            <TabsContent
                              value="Procedures"
                              className="border-0 w-fit text-center "
                            >
                              <DataTable
                                data={row.original.procedure}
                                columns={HospitalProcedureColumns()}
                                pagination={false}
                              />{" "}
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
