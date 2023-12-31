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
  getExpandedRowModel,
  ExpandedState,
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
  MedicalServiceDiagsColumns,
  MedicalServiceOpsColumns,
} from "./columns";
import { MedicalServiceT } from "../../../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronsDown, ChevronsDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@/components/ui/input";
import { Filter } from "../Filter";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleDataTableProps {
  columns: ColumnDef<any, any>[];
  data: MedicalServiceT[];
  pagination: boolean;
}

export function MedicalServiceTable({
  columns,
  data,
  pagination,
}: CollapsibleDataTableProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { formatMessage } = useIntl();

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    getSubRows: (row) => row.subRows,

    initialState: {
      pagination: {
        pageSize: 12,
      },
    },

    getPaginationRowModel: getPaginationRowModel(),

    onExpandedChange: setExpanded,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),

    state: {
      columnVisibility,
      sorting,
      columnFilters,
      globalFilter,
      expanded,
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
      <div
        className="max-h-[48rem] border-2 rounded-md overflow-y-auto bg-neutral-100"
        style={{ height: "75vh" }}
      >
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
              key="filterInput"
              placeholder={formatMessage({
                id: "Search_all_columns",
              })}
              className="p-2 font-lg shadow border border-block  max-w-sm rounded-md m-2 h-2/3"
              onChange={(event) => setGlobalFilter(event.target.value)}
            />
            <Button
              key="filterButton"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="m-2 shadow w-48"
            >
              {isFilterOpen ? (
                <FormattedMessage id="filter_close" />
              ) : (
                <FormattedMessage id="filter_open" />
              )}
            </Button>
          </div>
        </div>
        <Table
          className="h-fit max-h-[45rem] w-full"
          style={{ width: table.getTotalSize() }}
        >
          <TableHeader className="sticky top-0 bg-white z-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" w-full">
                {headerGroup.headers.map((header, idx) => {
                  return (
                    <>
                      <TableHead
                        className={cn(
                          " text-slate-950 bg-slate-100 py-5 text-center",
                          idx === 1 && "sticky left-0 z-30 bg-slate-100"
                        )}
                        key={header.id}
                        colSpan={header.colSpan}
                        draggable={
                          !table.getState().columnSizingInfo.isResizingColumn
                        }
                        data-column-index={header.index}
                        onDragStart={onDragStart}
                        onDragOver={(e): void => {
                          e.preventDefault();
                        }}
                        onDrop={onDrop}
                        // style={{
                        //   position: "relative",
                        //   width: header.getSize(),
                        // }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                        {header.column.getCanFilter()
                          ? isFilterOpen && (
                              <Filter column={header.column} table={table} />
                            )
                          : null}
                      </TableHead>
                    </>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <>
                <div
                  className="h-0 w-0  "
                >
                  <button
                    onClick={() => toggleRowExpansion(row.id)}
                    className="relative top-4 left-3 m-auto z-20 "
                  >
                    {expandedRows[row.id] ? (
                      <ChevronsDownUp size={20} />
                    ) : (
                      <ChevronsDown size={20} />
                    )}
                  </button>
                </div>
                <TableRow
                  key={row.id}
                  className="cursor-pointer "
                  data-state={expandedRows[row.id] && "selected"}
                  onClick={() => toggleRowExpansion(row.id)}
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <TableCell
                      className={cn(
                        "h-14 text-center whitespace-nowrap  bg-white ",
                        idx === 1 && "sticky left-0 z-10"
                      )}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {expandedRows[row.id] && (
                  <TableRow
                    className=" bg-neutral-100 "
                    key={`expanded-${row.id}`}
                  >
                    <TableCell colSpan={columns.length} key={row.id}>
                      {/* Add your expanded content here */}

                      {row.original.diags.length > 0 ||
                      row.original.ops.length > 0 ? (
                        <>
                          {row.original.diags.length > 0 && (
                            <div
                              className=" bg-neutral-100 pb-3 pl-10 "
                              key={row.id}
                              style={{ width: "65vw" }}
                            >
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                <FormattedMessage id="Diagnosis" />
                              </TableCaption>

                              <DataTable
                                data={row.original.diags}
                                columns={MedicalServiceDiagsColumns()}
                                pagination={true}
                                ifNeedPagination={expandedRows[row.id]}

                              />
                            </div>
                          )}

                          {row.original.ops.length > 0 && (
                            <div
                              className="mb-5 px-10 bg-neutral-100"
                              key={row.id}
                            >
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Operations:
                              </TableCaption>

                              <DataTable
                                data={row.original.ops}
                                columns={MedicalServiceOpsColumns()}
                                pagination={true}
                                ifNeedPagination={expandedRows[row.id]}

                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <TableRow key={row.id}>
                          <TableCell
                            colSpan={columns.length}
                            className="h-14 text-center"
                            key={row.id}
                          >
                            <FormattedMessage id="No_results" />{" "}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </>
  );
}
