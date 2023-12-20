import {
  ChevronRight,
  ChevronLeft,
  ChevronLast,
  ChevronFirst,
} from "lucide-react";

import { Table } from "@tanstack/react-table";

import { Button } from "../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormattedMessage } from "react-intl";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  ifNeedPagination?: boolean;
}

export function DataTablePagination<TData>({
  table,
  ifNeedPagination,
}: DataTablePaginationProps<TData>) {
  console.log(ifNeedPagination)
  return (
    <div className="flex items-center justify-between px-2 mt-4 flex-wrap">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length}{" "}
        <FormattedMessage id="results" />.
      </div>
      {ifNeedPagination ? null : (
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              <FormattedMessage id="Lines_per_page" />
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[12, 16, 24, 48, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            <FormattedMessage id="Page" />{" "}
            {table.getState().pagination.pageIndex + 1} von{" "}
            {table.getPageCount()}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
