import { ColumnDef } from "@tanstack/react-table";
import {
    HospitalT,
    MedaidT,
    MedicalServiceT,
    MedicationT,
    PatientT,
    RehabT,
    TaskT,
    WorkInabilityT,
    MappedWorkInabilityT,
} from "../../../../types";
import {
    ArrowDown,
    ArrowRight,
    ArrowUp,
    Circle,
    CheckCircle,
    Info,
} from "lucide-react";
import { DataTableRowActions } from "./task-row-actions";
import { FormattedMessage, useIntl } from "react-intl";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { showCostInTwoDigit, formatDateForHospital } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormatDate } from "@/lib/format-date";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../tooltip";

// Insured

export const PatientColumns = (): ColumnDef<PatientT>[] => {
    const { formatMessage, locale } = useIntl();
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
            cell: ({ row }) => FormatDate(row.getValue("Date_of_birth")),
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
            cell: ({ row }) => FormatDate(row.getValue("Entry_date")),
        },
        {
            accessorKey: "Discharge_date",
            header: formatMessage({ id: "Discharge_date" }),
            cell: ({ row }) => FormatDate(row.getValue("Discharge_date")),
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
        {
            accessorKey: "date",
            header: formatMessage({ id: "Date" }),
            cell: ({ row }) => FormatDate(row.getValue("date")),
        },

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
        {
            accessorKey: "deadline",
            header: formatMessage({ id: "Deadline" }),
            cell: ({ row }) => FormatDate(row.getValue("deadline")),
        },
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
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Case_number" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            id: formatMessage({ id: "Case_number" }),
        },
        {
            accessorKey: "Insurance_area",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Insurance_area" />
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            id: formatMessage({ id: "Insurance_area" }),
            meta: "string",
        },

        {
            accessorKey: "Quarter",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Quarter" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            id: formatMessage({ id: "Quarter" }),
        },
        {
            accessorKey: "ID_Prescriber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="ID_Prescriber" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },

        {
            accessorKey: "Physician_specialty_group",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Physician_specialty_group" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Is_accident",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Is_accident" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Treatment_type",
            id: formatMessage({ id: "Treatment_type" }),
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Treatment_type" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Points",

            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Points" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Total_costs",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Total_costs" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },

            cell: ({ row }) => showCostInTwoDigit(row.getValue("Total_costs")),
        },
        {
            accessorKey: "Calculated_costs",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Calculated_costs" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },

            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Calculated_costs")),
        },
        {
            accessorKey: "Non_budget_costs",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Non_budget_costs" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },

            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Non_budget_costs")),
        },
        {
            accessorKey: "Dialysis_costs",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Dialysis_costs" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },

            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Dialysis_costs")),
        },
        {
            accessorKey: "Start_Treatment",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Start_Treatment" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => FormatDate(row.getValue("Start_Treatment")),
        },
        {
            accessorKey: "End_Treatment",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="End_Treatment" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => FormatDate(row.getValue("End_Treatment")),
        },
        {
            accessorKey: "Insurance_stats_5",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Insurance_stats_5" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Distance",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Distance" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Insurance_stats_2",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Insurance_stats_2" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
    ];
};

export const MedicalServiceDiagsColumns = (): ColumnDef<
    MedicalServiceT["diags"]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Number_ICD",
            header: formatMessage({ id: "Number_ICD" }),
        },
        {
            accessorKey: "ICD",
            header: formatMessage({ id: "ICD" }),
        },
        {
            accessorKey: "Quality_ICD",
            header: formatMessage({ id: "Quality_ICD" }),
        },
        {
            accessorKey: "Localization_ICD",
            header: formatMessage({ id: "Localization_ICD" }),
        },
    ];
};

export const MedicalServiceOpsColumns = (): ColumnDef<
    MedicalServiceT["ops"]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Quarter",
            header: formatMessage({ id: "Quarter" }),
        },
        {
            accessorKey: "Number_procedure",
            header: formatMessage({ id: "Number_procedure" }),
        },
        {
            accessorKey: "Identifier_operation",
            header: formatMessage({ id: "Identifier_operation" }),
        },
        {
            accessorKey: "Localization_procedure",
            header: formatMessage({ id: "Localization_procedure" }),
        },
    ];
};

// Medication

export const MedicationColumns = (): ColumnDef<MedicationT>[] => {
    return [
        {
            accessorKey: "Issue_date",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Issue_date" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => FormatDate(row.getValue("Issue_date")),
        },
        {
            accessorKey: "ID_Prescriber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Issue_date" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Group_prescriber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Issue_date" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
        {
            accessorKey: "Kv_area_prescriber",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }>
                        <FormattedMessage id="Issue_date" />

                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        },
    ];
};

export const MedicationPositionsColumns = (): ColumnDef<
    MedicationT["positions"]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Date_Prescription",
            header: formatMessage({ id: "Date_prescription" }),
            cell: ({ row }) => FormatDate(row.getValue("Date_Prescription")),
        },
        {
            accessorKey: "Pharmaceutical_registration_number",
            header: formatMessage({ id: "Pharmaceutical_registration_number" }),
            cell: ({ row }) => {
                //@ts-ignore
                const pznText = row.original.pzn_text;

                const pznTextTooltip = (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center">
                                {row.getValue("Substance_code")}
                                <Info className="w-4 h-4 ml-1" />
                            </TooltipTrigger>
                            <TooltipContent>{pznText as string}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );

                return pznText ? (
                    pznTextTooltip
                ) : (
                    <div>{row.getValue("Substance_code")}</div>
                );
            },
        },
        {
            accessorKey: "Total_cost_medication",
            header: formatMessage({ id: "Total_cost_medication" }),
            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Total_cost_medication")),
        },
        {
            accessorKey: "Individual_cost_medication",
            header: formatMessage({ id: "Individual_cost_medication" }),
            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Individual_cost_medication")),
        },
        {
            accessorKey: "Package_size",
            header: formatMessage({ id: "Package_size" }),
        },
        {
            accessorKey: "Substance_code",
            header: formatMessage({ id: "Substance_code" }),
            cell: ({ row }) => {
                //@ts-ignore
                const substanceCodeText = row.original.Substance_code_text;

                const substanceCodeTextTooltip = (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center">
                                {row.getValue("Substance_code")}
                                <Info className="w-4 h-4 ml-1" />
                            </TooltipTrigger>
                            <TooltipContent>
                                {substanceCodeText as string}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );

                return substanceCodeText ? (
                    substanceCodeTextTooltip
                ) : (
                    <div>{row.getValue("Substance_code")}</div>
                );
            },
        },
        {
            accessorKey: "Daily_dosage",
            header: formatMessage({ id: "Daily_dosage" }),
        },
        {
            accessorKey: "Total_cost_prescription",
            header: formatMessage({ id: "Total_cost_prescription" }),
            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Total_cost_prescription")),
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
            accessorKey: "Medical_aid_position_number",
            header: formatMessage({ id: "Medical_aid_position_number" }),
        },
    ];
};

// Work Inability

export const WorkInabilityPaymentsColumns = (): ColumnDef<
    MappedWorkInabilityT["payments"][0]["diagnosis"][0]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Main_ICD",
            header: formatMessage({ id: "Main_ICD" }),
        },
        {
            accessorKey: "Case_ID",
            header: formatMessage({ id: "Case_ID" }),
        },
        {
            accessorKey: "Start_benefits",
            header: formatMessage({ id: "Start_benefits" }),
            cell: ({ row }) => FormatDate(row.getValue("Start_benefits")),
        },
        {
            accessorKey: "End_benefits",
            header: formatMessage({ id: "End_benefits" }),
            cell: ({ row }) => FormatDate(row.getValue("End_benefits")),
        },
        {
            accessorKey: "Total_days_benefits",
            header: formatMessage({ id: "Total_days_benefits" }),
        },
        {
            accessorKey: "ID_Prescriber",
            header: formatMessage({ id: "ID_Prescriber" }),
        },
        {
            accessorKey: "Core_ID_prescriber",
            header: formatMessage({ id: "Core_ID_prescriber" }),
        },
        {
            accessorKey: "Physician_Specialty_Group",
            header: formatMessage({ id: "Physician_Specialty_Group" }),
        },
        {
            accessorKey: "Payment_area",
            header: formatMessage({ id: "Payment_area" }),
        },
        {
            accessorKey: "Type_EEL",
            header: formatMessage({ id: "Type_EEL" }),
        },
        {
            accessorKey: "Start_EEL",
            header: formatMessage({ id: "Start_EEL" }),
            cell: ({ row }) => FormatDate(row.getValue("Start_EEL")),
        },
        {
            accessorKey: "End_EEL",
            header: formatMessage({ id: "End_EEL" }),
            cell: ({ row }) => FormatDate(row.getValue("End_EEL")),
        },
        {
            accessorKey: "Total_days_EEL",
            header: formatMessage({ id: "Total_days_EEL" }),
        },
        {
            accessorKey: "Net_amount_EEL",
            header: formatMessage({ id: "Net_amount_EEL" }),
        },
    ];
};

export const WorkInabilityDiagnosisColumns =
    (): ColumnDef<WorkInabilityT>[] => {
        const { formatMessage } = useIntl();
        return [
            {
                accessorKey: "Date_diagnosis",
                header: formatMessage({ id: "Date_diagnosis" }),
                cell: ({ row }) => FormatDate(row.getValue("Date_diagnosis")),
            },
            {
                accessorKey: "Date_healing",
                header: formatMessage({ id: "Date_healing" }),
                cell: ({ row }) => FormatDate(row.getValue("Date_healing")),
            },
            {
                accessorKey: "Primary_diagnosis",
                header: formatMessage({ id: "Primary_diagnosis" }),
            },
            {
                accessorKey: "Secondary_diagnosis",
                header: formatMessage({
                    id: "Secondary_diagnosis",
                }),
            },
            {
                accessorKey: "Type_diagnosis",
                header: formatMessage({ id: "Type_diagnosis" }),
            },
            {
                accessorKey: "Localization_diagnosis",
                header: formatMessage({
                    id: "Localization_diagnosis",
                }),
            },
            {
                accessorKey: "Severity_diagnosis",
                header: formatMessage({ id: "Severity_diagnosis" }),
            },
            {
                accessorKey: "Certainty_diagnosis",
                header: formatMessage({
                    id: "Certainty_diagnosis",
                }),
            },
            {
                accessorKey: "Work_accident",
                header: formatMessage({ id: "Work_accident" }),
            },
            {
                accessorKey: "Physician_number",
                header: formatMessage({ id: "Physician_number" }),
            },
            {
                accessorKey: "Start_AU",
                header: formatMessage({ id: "Start_AU" }),
                cell: ({ row }) => FormatDate(row.getValue("Start_AU")),
            },
            {
                accessorKey: "End_AU",
                header: formatMessage({ id: "End_AU" }),
                cell: ({ row }) => FormatDate(row.getValue("End_AU")),
            },
            {
                accessorKey: "Start_application_AU",
                header: formatMessage({
                    id: "Start_application_AU",
                }),
                cell: ({ row }) =>
                    FormatDate(row.getValue("Start_application_AU")),
            },
            {
                accessorKey: "End_application_AU",
                header: formatMessage({ id: "End_application_AU" }),
                cell: ({ row }) =>
                    FormatDate(row.getValue("End_application_AU")),
            },
        ];
    };

// Medaid

export const MedaidColumns = (): ColumnDef<MedaidT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "ID_prescriber",
            header: formatMessage({ id: "ID_prescriber" }),
        },
        {
            accessorKey: "Date_prescription",
            header: formatMessage({ id: "Date_prescription" }),
            cell: ({ row }) => FormatDate(row.getValue("Date_prescription")),
        },
        {
            accessorKey: "Group_prescriber",
            header: formatMessage({ id: "Group_prescriber" }),
        },
    ];
};

export const MedaidPositionsColumns = (): ColumnDef<MedaidT["positions"]>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Occupation_group",
            header: formatMessage({ id: "Occupation_group" }),
        },
        {
            accessorKey: "Start_service",
            header: formatMessage({ id: "Start_service" }),
            cell: ({ row }) => FormatDate(row.getValue("Start_service")),
        },
        {
            accessorKey: "End_service",
            header: formatMessage({ id: "End_service" }),
            cell: ({ row }) => FormatDate(row.getValue("End_service")),
        },
        {
            accessorKey: "Net_amount",
            header: formatMessage({ id: "Net_amount" }),
            cell: ({ row }) => showCostInTwoDigit(row.getValue("Net_amount")),
        },
        {
            accessorKey: "Count",
            header: formatMessage({ id: "Count" }),
        },
        {
            accessorKey: "Number_medical_aid",
            header: formatMessage({ id: "Number_medical_aid" }),
        },
        {
            accessorKey: "Group_medical_aid",
            header: formatMessage({ id: "Group_medical_aid" }),
        },
        {
            accessorKey: "Group_ID_medical_aid",
            header: formatMessage({ id: "Group_ID_medical_aid" }),
        },
        {
            accessorKey: "Pharmaceutical_registration_number",
            header: formatMessage({ id: "Pharmaceutical_registration_number" }),
        },
        {
            accessorKey: "Diagnosis",
            header: formatMessage({ id: "Diagnosis" }),
        },
    ];
};

// Hospital

export const HospitalColumns = (): ColumnDef<HospitalT>[] => {
    const { formatMessage, formatTime } = useIntl();
    return [
        {
            accessorKey: "ID_Insured",
            header: formatMessage({ id: "ID_Insured" }),
        },
        {
            accessorKey: "Case_number",
            header: formatMessage({ id: "Case_number" }),
        },
        {
            accessorKey: "Admission_date",
            header: formatMessage({ id: "Admission_date" }),
            cell: ({ row }) =>
                formatDateForHospital(row.getValue("Admission_date")),
        },
        {
            accessorKey: "Reason_for_admission",
            header: formatMessage({ id: "Reason_for_admission" }),
        },
        // {
        //   accessorKey: "Admission_time",
        //   header: formatMessage({ id: "Admission_time" }),
        //   cell: ({ row }) => {
        //     const time = row.getValue("Admission_time") as string;
        //     return time.slice(0, 5);
        //   },
        // },
        {
            accessorKey: "Admission_weight_infant",
            header: formatMessage({ id: "Admission_weight_infant" }),
        },
        {
            accessorKey: "Reason_discharge",
            header: formatMessage({ id: "Reason_discharge" }),
        },
        {
            accessorKey: "Date_discharge",
            header: formatMessage({ id: "Date_discharge" }),
            cell: ({ row }) =>
                formatDateForHospital(row.getValue("Date_discharge")),
        },
        // {
        //   accessorKey: "Time_discharge",
        //   header: formatMessage({ id: "Time_discharge" }),
        //   cell: ({ row }) => {
        //     const time = row.getValue("Time_discharge") as string;
        //     return time.slice(0, 5);
        //   },
        // },
        {
            accessorKey: "Delivery_date",
            header: formatMessage({ id: "Delivery_date" }),
            cell: ({ row }) => FormatDate(row.getValue("Delivery_date")),
        },
        {
            accessorKey: "Number_of_ventilation_days",
            header: formatMessage({ id: "Number_of_ventilation_days" }),
        },
        {
            accessorKey: "Cost_total",
            header: formatMessage({ id: "Cost_total" }),
            cell: ({ row }) => showCostInTwoDigit(row.getValue("Cost_total")),
        },
        {
            accessorKey: "ID_Hospital",
            header: formatMessage({ id: "ID_Hospital" }),
        },
        {
            accessorKey: "Department_Admission",
            header: formatMessage({ id: "Department_Admission" }),
        },
        {
            accessorKey: "Department_Discharge",
            header: formatMessage({ id: "Department_Discharge" }),
        },
        {
            accessorKey: "ICD",
            header: formatMessage({ id: "ICD" }),
        },
        {
            accessorKey: "DRG",
            header: formatMessage({ id: "DRG" }),
        },
        {
            accessorKey: "Occupancy_days",
            header: formatMessage({ id: "Occupancy_days" }),
        },
    ];
};

export const HospitalDiagnosisColumns = (): ColumnDef<
    HospitalT["diagnosis"]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "ICD_Number",
            header: formatMessage({ id: "ICD_Number" }),
        },
        {
            accessorKey: "Localization_diagnosis",
            header: formatMessage({ id: "Localization_diagnosis" }),
        },
        {
            accessorKey: "ID_type_diagnosis",
            header: formatMessage({ id: "ID_type_diagnosis" }),
        },
        {
            accessorKey: "Type_diagnosis",
            header: formatMessage({ id: "Type_diagnosis" }),
        },
        {
            accessorKey: "Kind_diagnosis",
            header: formatMessage({ id: "Kind_diagnosis" }),
        },
    ];
};

export const HospitalBillingColumns = (): ColumnDef<HospitalT["billing"]>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Type_fee",
            header: formatMessage({ id: "Type_fee" }),
        },
        {
            accessorKey: "Start_billing",
            header: formatMessage({ id: "Start_billing" }),
            cell: ({ row }) => FormatDate(row.getValue("Start_billing")),
        },
        {
            accessorKey: "End_billing",
            cell: ({ row }) => FormatDate(row.getValue("End_billing")),
            header: formatMessage({ id: "End_billing" }),
        },
        {
            accessorKey: "Number_billings",
            header: formatMessage({ id: "Number_billings" }),
        },
        {
            accessorKey: "Total_amount_billed",
            header: formatMessage({ id: "Total_amount_billed" }),
        },
    ];
};

export const HospitalProcedureColumns = (): ColumnDef<
    HospitalT["procedure"]
>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "ID_operation",
            header: formatMessage({ id: "ID_operation" }),
        },
        {
            accessorKey: "Date_operation",
            header: formatMessage({ id: "Date_operation" }),
            cell: ({ row }) => FormatDate(row.getValue("Date_operation")),
        },
        {
            accessorKey: "Localization_Operation",
            header: formatMessage({ id: "Localization_Operation" }),
        },
        {
            accessorKey: "Category_115_SGB",
            header: formatMessage({ id: "Category_115_SGB" }),
        },
    ];
};

// Rehab

export const RehabColumns = (): ColumnDef<RehabT>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Hospital_indicator",
            header: formatMessage({ id: "Hospital_indicator" }),
        },
        {
            accessorKey: "Start_rehab",
            header: formatMessage({ id: "Start_rehab" }),
            cell: ({ row }) => FormatDate(row.getValue("Start_rehab")),
        },
    ];
};

export const RehabDiagnosisColumns = (): ColumnDef<RehabT["diagnosis"]>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "Type_diagnosis",
            header: formatMessage({ id: "Type_diagnosis" }),
        },
        {
            accessorKey: "Main_diagnosis",
            header: formatMessage({ id: "Main_diagnosis" }),
        },
        {
            accessorKey: "Localization_diagnosis",
            header: formatMessage({ id: "Localization_diagnosis" }),
        },
        {
            accessorKey: "Localization_diagnosis_addition",
            header: formatMessage({ id: "Localization_diagnosis_addition" }),
        },
        {
            accessorKey: "Primary_diagnosis",
            header: formatMessage({ id: "Primary_diagnosis" }),
        },
        {
            accessorKey: "Secondary_diagnosis",
            header: formatMessage({ id: "Secondary_diagnosis" }),
        },
    ];
};

export const RehabPaymentColumns = (): ColumnDef<RehabT["payment"]>[] => {
    const { formatMessage } = useIntl();
    return [
        {
            accessorKey: "End_rehab",
            header: formatMessage({ id: "End_rehab" }),
        },
        {
            accessorKey: "Main_diagnosis",
            header: formatMessage({ id: "Main_diagnosis" }),
        },
        {
            accessorKey: "Discharge_reason",
            header: formatMessage({ id: "Discharge_reason" }),
        },
        {
            accessorKey: "ID_care_level",
            header: formatMessage({ id: "ID_care_level" }),
        },
        {
            accessorKey: "Care_level",
            header: formatMessage({ id: "Care_level" }),
        },
        {
            accessorKey: "Payment_amount",
            header: formatMessage({ id: "Payment_amount" }),
            cell: ({ row }) =>
                showCostInTwoDigit(row.getValue("Payment_amount")),
        },
    ];
};
