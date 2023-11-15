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
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedMessage, useIntl } from "react-intl";
import { Input } from "@/components/ui/input";
import { Filter } from "../Filter";

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
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
  const [searchInput, setSearchInput] = useState("");

  const words = searchInput.trim().toLowerCase().split(/\s+/);

  const filteredItems = words.reduce((result, word) => {
    return data.filter((item) => item.Insurance_area.toString().includes(word));
  }, data);
  return (
    <>
      <div className="max-h-[45rem] border-2 rounded-md h-[40rem] overflow-y-auto  ">
        <div className="flex  ">
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
        <Table className="h-fit max-h-[45rem]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-slate-100 text-slate-950 hover:cursor-grab h-20"
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
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <>
                <TableRow
                  key={row.id}
                  className="cursor-pointer "
                  data-state={expandedRows[row.id] && "selected"}
                  onClick={() => toggleRowExpansion(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-14 text-center" key={cell.id}>
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
                      {/* Add your expanded content here */}

                      {row.original.diags.length > 0 ||
                      row.original.ops.length > 0 ? (
                        <>
                          {row.original.diags.length > 0 && (
                            <div className=" px-10 bg-neutral-100 w-1/2 mb-3 pl-10  " key={row.id}>
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                <FormattedMessage id="Diagnosis" />
                              </TableCaption>
                              <div className="w-fit">
                                <DataTable
                                  data={row.original.diags}
                                  columns={MedicalServiceDiagsColumns()}
                                  pagination={false}
                                />
                              </div>
                            </div>
                          )}

                          {row.original.ops.length > 0 && (
                            <div className="mb-5 px-10 bg-neutral-100 w-1/2" key={row.id}>
                              <TableCaption className="my-2 font-semibold text-slate-950">
                                Operations:
                              </TableCaption>

                              <DataTable
                                data={row.original.ops}
                                columns={MedicalServiceOpsColumns()}
                                pagination={false}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-14 text-center"
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
