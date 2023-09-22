import { ColumnDef } from "@tanstack/react-table";
import { PatientT, TaskT } from "../../../../types";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Circle,
    CheckCircle,
} from "lucide-react";
import { DataTableRowActions } from "./task-row-actions";
import { useIntl } from "react-intl";

// Insured

export const PatientColumns = (): ColumnDef<PatientT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "last_name",
            header: formatMessage({ id: "Last_name" }),
        },
        {
            accessorKey: "first_name",
            header: formatMessage({ id: "Firstname" }),
        },
        {
            accessorKey: "Date_of_birth",
            header: formatMessage({ id: "Date_of_birth" }),
        },
        { accessorKey: "Gender", header: formatMessage({ id: "Gender" }) },
        { accessorKey: "ZIP_code", header: formatMessage({ id: "ZIP_code" }) },
        {
            accessorKey: "Insured_person_number",
            header: formatMessage({ id: "Insured_person_number" }),
        },
        {
            accessorKey: "Entry_date",
            header: formatMessage({ id: "Entry_date" }),
        },
        {
            accessorKey: "Discharge_date",
            header: formatMessage({ id: "Discharge_date" }),
        },
        {
            accessorKey: "Reason_for_leaving",
            header: formatMessage({ id: "Reason_for_leaving" }),
        },
    ];
};

// Tasks

export const Priorities = () => {
    const { formatMessage } = useIntl();

    return [
        {
            label: formatMessage({ id: "Priority_low" }),
            value: "low",
            icon: ArrowDown,
        },
        {
            label: formatMessage({ id: "Priority_medium" }),
            value: "medium",
            icon: ArrowRight,
        },
        {
            label: formatMessage({ id: "Priority_high" }),
            value: "high",
            icon: ArrowUp,
        },
    ];
};

export const Statuses = () => {
    const { formatMessage } = useIntl();

    return [
        {
            label: formatMessage({ id: "Status_todo" }),
            value: false,
            icon: Circle,
        },
        {
            label: formatMessage({ id: "Status_done" }),
            value: true,
            icon: CheckCircle,
        },
    ];
};

//test to deploy
export const TasksColumns = (): ColumnDef<TaskT>[] => {
    const { formatMessage } = useIntl();

    return [
        {
            accessorKey: "insuranceNumber",
            header: formatMessage({ id: "Insured_person_number" }),
        },
        { accessorKey: "date", header: formatMessage({ id: "Date" }) },
        {
            accessorKey: "title",
            header: formatMessage({ id: "Title" }),
            cell: ({ row }) => {
                return <div className="w-fit">{row.getValue("title")}</div>;
            },
        },
        { accessorKey: "content", header: formatMessage({ id: "Content" }) },
        {
            accessorKey: "done",
            header: formatMessage({ id: "Done" }),
            cell: ({ row }) => {
                const status = Statuses().find(
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
            header: formatMessage({ id: "Priority" }),
            cell: ({ row }) => {
                const priority = Priorities().find(
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
        { accessorKey: "deadline", header: formatMessage({ id: "Deadline" }) },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ];
};
