import { ColumnDef } from "@tanstack/react-table";
import { InsuredT, TaskT } from "../../../../types";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Circle,
    CheckCircle,
} from "lucide-react";
import { DataTableRowActions } from "./task-row-actions";
import {useIntl, MessageDescriptor,FormattedMessage} from "react-intl";

// Insured

export const Columns=(): ColumnDef<InsuredT>[] =>{ 
    const {formatMessage} = useIntl();
    return[
    { accessorKey: "lastName", header: formatMessage({id:"Last_name"}) },
    { accessorKey: "firstName", header: formatMessage({id:"Firstname"}) },
    { accessorKey: "dateOfBirth", header: formatMessage({id:"Date_of_birth"})  },
    { accessorKey: "sex", header: formatMessage({id:"Gender"})  },
    { accessorKey: "zipcode", header: formatMessage({id:"ZIP_code"})  },
    { accessorKey: "insuranceNumber", header: formatMessage({id:"Insured_person_number"})  },
]};

// Tasks

export const Priorities = ()=>{
    const {formatMessage} = useIntl();
    
    return[
    {
        label: formatMessage({id:"Priority_low"}),
        value: "low",
        icon: ArrowDown,
    },
    {
        label: formatMessage({id:"Priority_medium"}),
        value: "medium",
        icon: ArrowRight,
    },
    {
        label: formatMessage({id:"Priority_high"}),
        value: "high",
        icon: ArrowUp,
    },
]};

export const Statuses =()=>{
    const {formatMessage} = useIntl();
    
    return [
    {
        label: formatMessage({id:"Status_todo"}),
        value: false,
        icon: Circle,
    },
    {
        label: formatMessage({id:"Status_done"}),
        value: true,
        icon: CheckCircle,
    }
]};

//test to deploy
export const TasksColumns = (): ColumnDef<TaskT>[] => {
    const {formatMessage} = useIntl();

    return [
            { accessorKey: "insuranceNumber", header:  formatMessage({id: "Insured_person_number"})  },
            { accessorKey: "date", header: formatMessage({id: "Date"}) },
            {
                accessorKey: "title",
                header: formatMessage({id: "Title"}),
                cell: ({ row }) => {
                    return <div className="w-fit">{row.getValue("title")}</div>;
                },
            },
            { accessorKey: "content", header: formatMessage({id: "Content"}) },
            {
                accessorKey: "done",
                header: formatMessage({id: "Done"}),
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
                header:formatMessage({id: "Priority"}),
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
                }
            },
            { accessorKey: "deadline", header: formatMessage({id: "Deadline"}) },
            {
                id: "actions",
                cell: ({ row }) => <DataTableRowActions row={row} />,
            },
        ]
};
