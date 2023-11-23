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
  return (
    <div>
      <DataTable data={data} columns={TasksColumns()} pagination />

      {/* here the pop up window is only for adding todo */}
      {/* <TaskDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        refetch={taskRelatedToUser.refetch}
      /> */}
    </div>
  );
}
