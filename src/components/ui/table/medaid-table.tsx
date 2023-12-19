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
import { MedaidPositionsColumns } from "./columns";
import { MedaidT } from "../../../../types";
import { Input } from "@/components/ui/input";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@/components/ui/button";
import { Filter } from "../Filter";
import { ChevronsDown, ChevronsDownUp } from "lucide-react";

interface CollapsibleDataTableProps {
  columns: ColumnDef<any, any>[];
  data: MedaidT[];
  pagination: boolean;
}

export function MadaidTable({
  columns,
  data,
  pagination,
}: CollapsibleDataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
        className="max-h-[45rem] border-2 rounded-md overflow-y-auto bg-neutral-100"
        style={{ height: "75vh" }}
      >
        <div className="flex">
          <Input
            placeholder={formatMessage({
              id: "Search_all_columns",
            })}
            className="p-2 font-lg shadow border border-block max-w-sm rounded-md m-2 h-2/3"
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
        <Table>
          <TableHeader className="sticky top-0 bg-white z-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-slate-100 text-slate-950 
                    hover:cursor-grab h-16 pt-4"
                    data-column-index={header.index}
                    draggable={
                      !table.getState().columnSizingInfo.isResizingColumn
                    }
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {
              table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      {expandedRows[row.id] ? (
                        <div className="h-0">
                          <button
                            onClick={() => toggleRowExpansion(row.id)}
                            className="relative top-4 left-3"
                          >
                            <ChevronsDownUp size={20} />{" "}
                          </button>
                        </div>
                      ) : (
                        <div className="h-0">
                          <button
                            onClick={() => toggleRowExpansion(row.id)}
                            className="relative top-4 left-3"
                          >
                            <ChevronsDown size={20} />
                          </button>
                        </div>
                      )}
                      <TableRow
                        key={row.id}
                        className="cursor-pointer"
                        data-state={expandedRows[row.id] && "selected"}
                        onClick={() => toggleRowExpansion(row.id)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell className="h-14 pl-6 bg-white" key={cell.id}>
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
                              {row.original.positions.length > 0 ? (
                                <div className="px-10 bg-neutral-100 mb-3 ">
                                  <TableCaption className="my-4 font-semibold text-slate-950">
                                    Positions:
                                  </TableCaption>
                                  <div className="flex flex-col space-y-5">
                                    <DataTable
                                      data={row.original.positions}
                                      columns={MedaidPositionsColumns()}
                                      pagination={false}
                                    />
                                  </div>
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
                            </>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                : null /* Handle no rows case */
            }
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePagination table={table} />}
    </>
  );
}
