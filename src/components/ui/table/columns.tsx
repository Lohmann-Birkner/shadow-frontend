import { ColumnDef } from "@tanstack/react-table";
import { InsuredPersonT, TaskT } from "../../../../types";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Circle,
    CheckCircle,
} from "lucide-react";
import { DataTableRowActions } from "./task-row-actions";

// Insured

export const columns: ColumnDef<InsuredPersonT>[] = [
    // { accessorKey: "ins_id", header: "ins_id" },
    { accessorKey: "first_name", header: "Vorname" },
    { accessorKey: "last_name", header: "Name" },
    { accessorKey: "Membership_number", header: "Mitgliedsnummer" },
    { accessorKey: "Person_indicator", header: "Personenkennzeichen" },
    { accessorKey: "Gender", header: "Geschlecht" },
    { accessorKey: "Date_of_birth", header: "Geburtsdatum" },
    { accessorKey: "ZIP_code", header: "Postleitzahl" },
    { accessorKey: "Insured_person_number", header: "Versichertennummer" },
    { accessorKey: "Entry_date", header: "Eintrittsdatum" },
    { accessorKey: "Discharge_date", header: "Austrittsdatum" },
    { accessorKey: "Reason_for_leaving", header: "Austrittsgrund" },

];

// Tasks

export const priorities = [
    {
        label: "Niedrig",
        value: "low",
        icon: ArrowDown,
    },
    {
        label: "Mittel",
        value: "medium",
        icon: ArrowRight,
    },
    {
        label: "Hoch",
        value: "high",
        icon: ArrowUp,
    },
];

export const statuses = [
    {
        label: "Todo",
        value: false,
        icon: Circle,
    },
    {
        label: "Erledigt",
        value: true,
        icon: CheckCircle,
    },
];

export const tasksColumns: ColumnDef<TaskT>[] = [
    { accessorKey: "insuranceNumber", header: "Versichertennummer" },
    { accessorKey: "date", header: "Datum" },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            return <div className="w-fit">{row.getValue("title")}</div>;
        },
    },
    { accessorKey: "content", header: "Inhalt" },
    {
        accessorKey: "done",
        header: "Status",
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue("done")
            );

            if (!status) {
                return null;
            }

            return (
                <div className="flex items-center">
                    {status.icon && (
                        <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{status.label}</span>
                </div>
            );
        },
    },

    {
        accessorKey: "priority",
        header: "Priorität",
        cell: ({ row }) => {
            const priority = priorities.find(
                (priority) => priority.value === row.getValue("priority")
            );

            if (!priority) {
                return null;
            }

            return (
                <div className="flex items-center">
                    {priority.icon && (
                        <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{priority.label}</span>
                </div>
            );
        },
    },
    { accessorKey: "deadline", header: "Deadline" },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
