import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
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
import { WorkInabilityDiagnosisColumns } from "./columns";
import { WorkInabilityT } from "../../../../types";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronsDown,
  ChevronsDownUp,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "../Filter";

interface CollapsibleDataTableProps {
  columns: ColumnDef<any, any>[];
  data: WorkInabilityT[];
  pagination: boolean;
}

export function WorkInabilityTable({
  columns,
  data,
  pagination,
}: CollapsibleDataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { formatMessage } = useIntl();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      globalFilter,
      columnFilters,
      sorting,
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
        className="rounded-md max-h-[45rem] border-2 overflow-y-auto bg-neutral-100"
        style={{ height: "75vh" }}
      >
        <div className="flex">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="m-2 shadow ">
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
        <Table>
          <TableHeader className="sticky top-0 bg-white z-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-slate-100 text-slate-950 
                      hover:cursor-grab h-20 pt-4"
                      key={header.id}
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
                      //   width: header.getSize(),
                      // }}
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
                  {expandedRows[row.id] ? (
                    <div className="h-0">
                      <button
                        onClick={() => toggleRowExpansion(row.id)}
                        className="relative top-7 left-1"
                      >
                        <ChevronsDownUp size={20} />{" "}
                      </button>
                    </div>
                  ) : (
                    <div className="h-0">
                      <button
                        onClick={() => toggleRowExpansion(row.id)}
                        className="relative top-7 left-1"
                      >
                        <ChevronsDown size={20} />
                      </button>
                    </div>
                  )}
                  <TableRow
                    key={row.id}
                    className="cursor-pointer h-20"
                    data-state={expandedRows[row.id] && "selected"}
                    onClick={() => toggleRowExpansion(row.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="h-14 pl-4 bg-white"
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
                      className="hover:bg-neutral-100 bg-neutral-100 "
                      key={`expanded-${row.id}`}
                    >
                      <TableCell colSpan={columns.length}>
                        {/* Add your expanded content here */}
                        <>
                          {row.original.diagnosis.length > 0 ? (
                            <div className=" px-10 bg-neutral-100 w-9/10 mb-3">
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                <FormattedMessage id="Diagnosis" />
                              </TableCaption>

                              <DataTable
                                data={row.original.diagnosis}
                                columns={WorkInabilityDiagnosisColumns()}
                                pagination={true}
                                ifNeedPagination={expandedRows[row.id]}
                              />
                              {/* for all the nested tables, we dont need paganation
                              only the total amount of data will be shown. this is role for ifNeedPaganation
                              */}
                            </div>
                          ) : (
                            <FormattedMessage id="No_results" />
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
