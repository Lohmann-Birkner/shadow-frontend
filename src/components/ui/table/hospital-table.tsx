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
import { Filter } from "../Filter";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
  // how to drag and drop the columns
  let columnBeingDragged: number;

  const onDragStart = (e: React.DragEvent<HTMLElement>): void => {
    columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
  };

  const onDrop = (e: React.DragEvent<HTMLElement>): void => {
    e.preventDefault();
    const newPosition = Number(e.currentTarget.dataset.columnIndex);
    const currentCols = table.getVisibleLeafColumns().map((c) => c.id);
    const colToBeMoved = currentCols.splice(columnBeingDragged, 1);

    currentCols.splice(newPosition, 0, colToBeMoved[0]);
    table.setColumnOrder(currentCols); // <------------------------here you save the column ordering state
  };

  return (
    <>
      <div className="rounded-md h-full overflow-y-auto border-2">
        <div className="flex">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="m-2 shadow">
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
          <div className="flex">
            <Input
              placeholder={formatMessage({
                id: "Search_all_columns",
              })}
              className="p-2 font-lg shadow border border-block  max-w-sm rounded-md m-2 h-2/3"
              onChange={(event) => setGlobalFilter(event.target.value)}
            />{" "}
            <Button
              key="filterButton"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="m-2 shadow w-48"
            >
              <FormattedMessage id="filter_open" />
            </Button>
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
                      className=" text-slate-950 bg-slate-100 
                      h-20 hover:cursor-grab pt-4"
                      draggable={
                        !table.getState().columnSizingInfo.isResizingColumn
                      }
                      data-column-index={header.index}
                      onDragStart={onDragStart}
                      onDragOver={(e): void => {
                        e.preventDefault();
                      }}
                      onDrop={onDrop}
                    >
                      <div className="h-9">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </div>
                      {header.column.getCanFilter()
                        ? isFilterOpen && (
                            <Filter column={header.column} table={table} />
                          )
                        : null}
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
                      <TableCell colSpan={columns.length} key={row.id}>
                        <Tabs value={tab} onValueChange={setTab}>
                          <TabsList className=" font-semibold text-slate-950 bg-neutral-100 rounded-md">
                            <TabsTrigger
                              key="Diagnosis"
                              value="Diagnosis"
                              className="bg-neutral-100 "
                            >
                              <FormattedMessage id="Diagnosis" />
                            </TabsTrigger>
                            <TabsTrigger
                              key="Billings"
                              value="Billings"
                              className="bg-neutral-100"
                            >
                              <FormattedMessage id="Billings" />
                            </TabsTrigger>
                            <TabsTrigger
                              value="Procedures"
                              key="Procedures"
                              className="bg-neutral-100"
                            >
                              <FormattedMessage id="Procedures" />
                            </TabsTrigger>
                          </TabsList>
                          {/* Add your expanded content here */}
                          {row.original.diagnosis.length > 0 ? (
                            <TabsContent
                              value="Diagnosis"
                              className="pl-6 border-0 w-fit"
                            >
                              <DataTable
                                data={row.original.diagnosis}
                                columns={HospitalDiagnosisColumns()}
                                pagination={false}
                                className="w-1/3"
                              />
                            </TabsContent>
                          ) : (
                            <TabsContent
                              value="Diagnosis"
                              className="pl-6 border-0 w-fit"
                            >
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length}
                                  className="h-14 pl-6"
                                >
                                  <FormattedMessage id="No_results" />
                                </TableCell>
                              </TableRow>
                            </TabsContent>
                          )}
                          {row.original.billing.length > 0 ? (
                            <TabsContent
                              value="Billings"
                              className="pl-6 border-0 w-fit"
                            >
                              <DataTable
                                data={row.original.billing}
                                columns={HospitalBillingColumns()}
                                pagination={false}
                              />
                            </TabsContent>
                          ) : (
                            <TabsContent
                              value="Billings"
                              className="pl-6 border-0 w-fit"
                            >
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length}
                                  className="h-14 pl-6"
                                >
                                  <FormattedMessage id="No_results" />
                                </TableCell>
                              </TableRow>
                            </TabsContent>
                          )}
                          {row.original.procedure.length > 0 ? (
                            <TabsContent
                              value="Procedures"
                              className="border-0 pl-6 w-fit "
                            >
                              <DataTable
                                data={row.original.procedure}
                                columns={HospitalProcedureColumns()}
                                pagination={false}
                              />{" "}
                            </TabsContent>
                          ) : (
                            <TabsContent
                              value="Procedures"
                              className="pl-6 border-0 w-fit"
                            >
                              <TableRow>
                                <TableCell
                                  colSpan={columns.length}
                                  className="h-14 pl-6"
                                >
                                  <FormattedMessage id="No_results" />
                                </TableCell>
                              </TableRow>
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
