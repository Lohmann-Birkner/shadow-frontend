import { ColumnDef } from "@tanstack/react-table";
import {
    MedicalServiceT,
    MedicationT,
    OpsT,
    PatientT,
    PositionsT,
    TaskT,
} from "../../../../types";
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
            accessorKey: "Insurance_area",
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

// Medical Service

export const MedicalServiceColumns = (): ColumnDef<MedicalServiceT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Case_number",
            header: formatMessage({ id: "Case_number" }),
        },
        {
            accessorKey: "Insurance_area",
            header: formatMessage({ id: "Insurance_area" }),
        },
        {
            accessorKey: "Quarter",
            header: formatMessage({ id: "Quarter" }),
        },
        {
            accessorKey: "ID_Prescriber",
            header: formatMessage({ id: "ID_Prescriber" }),
        },

        {
            accessorKey: "Physician_specialty_group",
            header: formatMessage({ id: "Physician_specialty_group" }),
        },
        {
            accessorKey: "Is_accident",
            header: formatMessage({ id: "Is_accident" }),
        },
        {
            accessorKey: "Treatment_type",
            header: formatMessage({ id: "Treatment_type" }),
        },
        {
            accessorKey: "Points",
            header: formatMessage({ id: "Points" }),
        },
        {
            accessorKey: "Total_costs",
            header: formatMessage({ id: "Total_costs" }),
        },
        {
            accessorKey: "Calculated_costs",
            header: formatMessage({ id: "Calculated_costs" }),
        },
        {
            accessorKey: "Non_budget_costs",
            header: formatMessage({ id: "Non_budget_costs" }),
        },
        {
            accessorKey: "Dialysis_costs",
            header: formatMessage({ id: "Dialysis_costs" }),
        },
        {
            accessorKey: "Start_Treatment",
            header: formatMessage({ id: "Start_Treatment" }),
        },
        {
            accessorKey: "End_Treatment",
            header: formatMessage({ id: "End_Treatment" }),
        },
        {
            accessorKey: "Insurance_stats_5",
            header: formatMessage({ id: "Insurance_stats_5th_digit" }),
        },
        {
            accessorKey: "Distance",
            header: formatMessage({ id: "Distance" }),
        },
        {
            accessorKey: "Insurance_stats_2",
            header: formatMessage({ id: "Insurance_stats_2nd_digit" }),
        },
    ];
};

export const MedicationColumns = (): ColumnDef<MedicationT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Issue_date",
            header: formatMessage({ id: "Issue_date" }),
        },
        {
            accessorKey: "ID_Prescriber",
            header: formatMessage({ id: "ID_Prescriber" }),
        },
        {
            accessorKey: "Group_prescriber",
            header: formatMessage({ id: "Group_prescriber" }),
        },
        {
            accessorKey: "KV_area_Prescriber",
            header: formatMessage({ id: "KV_area_Prescriber" }),
        },
    ];
};

export const PositionsColumns = (): ColumnDef<PositionsT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Date_Prescription",
            header: formatMessage({ id: "Date_Prescription" }),
        },
        {
            accessorKey: "Pharmaceutical_registration_number",
            header: formatMessage({ id: "Pharmaceutical_registration_number" }),
        },
        {
            accessorKey: "Total_cost_medication",
            header: formatMessage({ id: "Total_cost_medication" }),
        },
        {
            accessorKey: "Individual_cost_medication",
            header: formatMessage({ id: "Individual_cost_medication" }),
        },
        {
            accessorKey: "Package_size",
            header: formatMessage({ id: "Package_size" }),
        },
        {
            accessorKey: "Substance_code",
            header: formatMessage({ id: "Substance_code" }),
        },
        {
            accessorKey: "Daily_dosage",
            header: formatMessage({ id: "Daily_dosage" }),
        },
        {
            accessorKey: "Total_cost_prescription",
            header: formatMessage({ id: "Total_cost_prescription" }),
        },
        {
            accessorKey: "Surcharge",
            header: formatMessage({ id: "Surcharge" }),
        },
        {
            accessorKey: "Care_provider_type",
            header: formatMessage({ id: "Care_provider_type" }),
        },
        {
            accessorKey: "Medical_Aid_position_number",
            header: formatMessage({ id: "Medical_Aid_position_number" }),
        },
    ];
};
