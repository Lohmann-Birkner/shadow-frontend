import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, ArrowUpDown, Search, Plus } from "lucide-react";
import { useState } from "react";
import { TasksColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import TaskDialog from "@/components/forms/task-dialog";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTaskRelatedToUserById, updateTaskByTaskId } from "@/api";
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
import { TaskRelatedToUserT } from "../../../../types";
import { DataTablePagination } from "./data-table-pagination";
import { prioritySort } from "@/lib/utils";
interface CollapsibleDataTableProps {
  columns: ColumnDef<any, any>[];
  data: TaskRelatedToUserT[];
  pagination: boolean;
}

export default function AufgabeRelatedToPatient({
  columns,
  data,
  pagination,
}: CollapsibleDataTableProps) {
  const { formatMessage } = useIntl();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    sortingFns: {
      myCustomSorting: prioritySort,
    },
  });

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
      <div className="max-h-[45rem] border-2 rounded-md h-[40rem] overflow-y-auto">
        <div className="flex">
          <Input
            placeholder={formatMessage({
              id: "Search_all_columns",
            })}
            className="p-2 font-lg shadow border border-block max-w-sm rounded-md m-2 h-2/3"
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
          {/* <DataTable data={data} columns={columnsRelatedToPatient} pagination /> */}
          <Button onClick={() => setIsDialogOpen(true)} variant={"outline"} className="p-2 m-2">
            <Plus className="h-4 w-4 mr-1" />
            <FormattedMessage id="Add_task" />
          </Button>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-slate-100 text-slate-950 hover:cursor-grab h-14"
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
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
         {data&& <TableBody>
            {
              table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow key={row.id} className="cursor-pointer">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell className="h-14 pl-6" key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </React.Fragment>
                  ))
                : null /* Handle no rows case */
            }
          </TableBody>}
        </Table>
      </div>
      {/* here the pop up window is only for adding todo */}
      <TaskDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
      {data&&pagination && <DataTablePagination table={table} />}
    </>
  );
}
