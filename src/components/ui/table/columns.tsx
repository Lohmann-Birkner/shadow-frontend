import {
  ColumnDef,
  FilterFn,
  filterFns,
  flexRender,
} from "@tanstack/react-table";
import {
  HospitalT,
  MedaidT,
  MedicalServiceT,
  MedicationT,
  PatientT,
  RehabT,
  TaskT,
  WorkInabilityT,
  Position,
  TaskRelatedToUserT,
} from "../../../../types";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  Info,
  Columns,
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
import PrescriberTable from "./prescriber-table";

//this function is built to filter the columns with data type number,
//so that the column can be filtered according to a range and also an exact number

const mulitiFunctionFilter: FilterFn<any> = (
  row,
  columnId: string,
  filterValue: number[]
) => {
  let [min, max] = filterValue;
  const value = row.getValue<number>(columnId);
  if (filterValue.toString().includes(",")) {
    if (filterValue.toString() == ",") return true;
    return value >= (min ?? 0) && value <= (max ?? Infinity);
  } else {
    const search = String(filterValue).toLowerCase();
    // Convert to String
    const value = String(row.getValue<string>(columnId));
    return value?.toLowerCase().includes(search);
  }
};

// Insured

export const PatientColumns = (): ColumnDef<PatientT>[] => {
  const { formatMessage, locale } = useIntl();
  return [
    {
      accessorKey: "last_name",
      header: formatMessage({ id: "Last_name" }),
    },
    {
      accessorKey: "first_name",
      header: formatMessage({ id: "first_name" }),
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

export const TasksColumns = (): ColumnDef<TaskRelatedToUserT>[] => {
  const { formatMessage } = useIntl();

  return [
    {
      accessorKey: "related_patient_id",
      header: formatMessage({ id: "Membership_number" }),
    },
    {
      accessorKey: "todo_date",
      header: formatMessage({ id: "Date" }),
      cell: ({ row }) => FormatDate(row.getValue("todo_date")),
    },

    {
      accessorKey: "todo_title",
      header: formatMessage({ id: "Title" }),
      cell: ({ row }) => {
        return <div className="w-fit">{row.getValue("todo_title")}</div>;
      },
    },
    { accessorKey: "todo_content", header: formatMessage({ id: "Content" }) },
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
      accessorKey: "todo_deadline",
      header: formatMessage({ id: "Deadline" }),
      cell: ({ row }) => FormatDate(row.getValue("todo_deadline")),
    },
    {
      //here are the 3 points in the aufgabe list(the end of the row)
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Case_number" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      id: "Case_number",
    },
    {
      accessorKey: "Insurance_area",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Insurance_area" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      id: "Insurance_area",
      // meta: "string",

      accessorFn: (originalRow) => originalRow.Insurance_area.toString(),
    },

    {
      accessorKey: "Quarter",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Quarter" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      id: "Quarter",
      // accessorFn: (originalRow) => originalRow.Quarter.toString(),
      filterFn: mulitiFunctionFilter,
    },
    {
      accessorKey: "ID_Prescriber",
      id: "ID_Prescriber",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Core_ID_prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <PrescriberTable
            prescriberId={row.original.ID_Prescriber}
            data={row.original.Prescriber_information}
          />
        );
      },
    },

    {
      accessorKey: "Physician_specialty_group",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Treatment_type" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Points",
      id: "Points",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Points" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      filterFn: mulitiFunctionFilter,
    },
    {
      accessorKey: "Total_costs",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Total_costs" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => showCostInTwoDigit(row.getValue("Total_costs")),
    },
    {
      accessorKey: "Calculated_costs",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Calculated_costs" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => showCostInTwoDigit(row.getValue("Calculated_costs")),
    },
    {
      accessorKey: "Non_budget_costs",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Non_budget_costs" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => showCostInTwoDigit(row.getValue("Non_budget_costs")),
    },
    {
      accessorKey: "Dialysis_costs",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Dialysis_costs" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },

      cell: ({ row }) => showCostInTwoDigit(row.getValue("Dialysis_costs")),
    },
    {
      accessorKey: "Start_Treatment",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Insurance_status_5th_digit" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Distance",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Insurance_status_2nd_digit" />

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
      accessorKey: "ICD_Text",
      header: formatMessage({ id: "ICD_Text" }),
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
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Issue_date" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("Issue_date")),
    },
    {
      accessorKey: "ID_Prescriber",
      id: "ID_Prescriber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ID_Prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      filterFn: mulitiFunctionFilter,
      cell: ({ row }) => {
        return (
          <PrescriberTable
            prescriberId={row.original.ID_Prescriber}
            data={row.original.Prescriber_information}
          />
        );
      },
    },
    {
      accessorKey: "Group_prescriber",
      id: "Group_prescriber",

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Group_prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      filterFn: mulitiFunctionFilter,
    },
    {
      accessorKey: "KV_area_Prescriber",
      id: "KV_area_Prescriber",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="KV_area_Prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];
};

export const MedicationPositionsColumns = (): ColumnDef<
  MedicationT["positions"][0]
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
        const pznText = row.original.pzn_text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Pharmaceutical_registration_number")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{pznText as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return pznText ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Pharmaceutical_registration_number")}</div>
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
              <TooltipContent>{substanceCodeText as string}</TooltipContent>
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
      cell: ({ row }) => showCostInTwoDigit(row.getValue("Surcharge")),
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

export const WorkInabilityColumns = (): ColumnDef<WorkInabilityT>[] => {
  return [
    {
      accessorKey: "Main_ICD",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Main_ICD" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const Main_ICD_Text = row.original.Main_ICD_Text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Main_ICD")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{Main_ICD_Text as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return Main_ICD_Text ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Main_ICD")}</div>
        );
      },
    },
    {
      accessorKey: "Case_ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Case_ID" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Start_work_inability",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Start_work_inability" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("Start_work_inability")),
    },
    {
      accessorKey: "End_work_inability",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="End_work_inability" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("End_work_inability")),
    },
    {
      accessorKey: "Total_days_benefits",
      id: "Total_days_benefits",
      filterFn: mulitiFunctionFilter,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Total_days_benefits" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "ID_Prescriber",
      id: "ID_Prescriber",

      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ID_Prescriber" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <PrescriberTable
            prescriberId={row.original.ID_Prescriber}
            data={row.original.Prescriber_information}
          />
        );
      },
    },
    {
      filterFn: mulitiFunctionFilter,
      accessorKey: "Core_ID_prescriber",
      id: "Core_ID_prescriber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Core_ID_prescriber" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Physician_Specialty_Group",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Physician_Specialty_Group" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Payment_area",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Payment_area" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Type_EEL",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Type_EEL" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Start_EEL",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Start_EEL" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("Start_EEL")),
    },
    {
      accessorKey: "End_EEL",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="End_EEL" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("End_EEL")),
    },
    {
      filterFn: mulitiFunctionFilter,
      accessorKey: "Total_days_EEL",
      id: "Total_days_EEL",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Total_days_EEL" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      filterFn: mulitiFunctionFilter,
      accessorKey: "Net_amount_EEL",
      id: "Net_amount_EEL",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Net_amount_EEL" />
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];
};

export const WorkInabilityDiagnosisColumns = (): ColumnDef<
  WorkInabilityT["diagnosis"][0]
>[] => {
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
      cell: ({ row }) => {
        const Main_ICD_Text = row.original.Main_ICD_Text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Primary_diagnosis")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{Main_ICD_Text as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return Main_ICD_Text ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Primary_diagnosis")}</div>
        );
      },
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
      cell: ({ row }) => FormatDate(row.getValue("Start_application_AU")),
    },
    {
      accessorKey: "End_application_AU",
      header: formatMessage({ id: "End_application_AU" }),
      cell: ({ row }) => FormatDate(row.getValue("End_application_AU")),
    },
  ];
};

// Medaid

export const MedaidColumns = (): ColumnDef<MedaidT>[] => {
  return [
    {
      accessorKey: "ID_prescriber",
      id: "ID_prescriber",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ID_Prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <PrescriberTable
            prescriberId={row.original.ID_prescriber}
            data={row.original.Prescriber_information}
          />
        );
      },
    },
    {
      accessorKey: "Date_prescription",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Date_prescription" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("Date_prescription")),
    },
    {
      accessorKey: "Group_prescriber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Group_prescriber" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];
};

export const MedaidPositionsColumns = (): ColumnDef<Position>[] => {
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
      cell: ({ row }) => {
        const medaid_text = row.original.medaid_text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Number_medical_aid")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{medaid_text as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return medaid_text ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Number_medical_aid")}</div>
        );
      },
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
      cell: ({ row }) => {
        const PZN_Text = row.original.PZN_Text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Pharmaceutical_registration_number")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{PZN_Text as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return PZN_Text ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Pharmaceutical_registration_number")}</div>
        );
      },
    },
    {
      accessorKey: "Diagnosis",
      header: formatMessage({ id: "Diagnosis" }),

      cell: ({ row }) => {
        const ICDText = row.original.ICD_Text;

        const pznTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Diagnosis")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{ICDText as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return ICDText ? (
          pznTextTooltip
        ) : (
          <div>{row.getValue("Diagnosis")}</div>
        );
      },
    },
  ];
};

// Hospital

export const HospitalColumns = (): ColumnDef<HospitalT>[] => {
  return [
    {
      accessorKey: "ID_Insured",
      id: "ID_Insured",
      filterFn: mulitiFunctionFilter,
          

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ID_Insured" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Case_number",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Case_number" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Admission_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Admission_date" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDateForHospital(row.getValue("Admission_date")),
    },
    {
      accessorKey: "Reason_admission",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Reason_admission" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const addimisionText = row.original.Reason_admission_text;

        const seperateAddimisionReason = addimisionText.split("/n");

        const addimisionTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Reason_admission")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                {seperateAddimisionReason[0]}
                <br />
                {seperateAddimisionReason[1]}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return addimisionText ? (
          addimisionTextTooltip
        ) : (
          <div>{row.getValue("Reason_admission")}</div>
        );
      },
    },

    {
      accessorKey: "Admission_weight_infant",
      id: "Admission_weight_infant",
      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Admission_weight_infant" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Reason_discharge",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Reason_discharge" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const dischargeText = row.original.Reason_discharge_text;

        const seperateDischargeReason = dischargeText.split("/n");

        const dischargeTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Reason_discharge")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                {seperateDischargeReason[0]}
                <br />
                {seperateDischargeReason[1]}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return dischargeText ? (
          dischargeTextTooltip
        ) : (
          <div>{row.getValue("Reason_discharge")}</div>
        );
      },
    },

    {
      accessorKey: "Date_discharge",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Date_discharge" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => formatDateForHospital(row.getValue("Date_discharge")),
    },

    {
      accessorKey: "Delivery_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Delivery_date" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => FormatDate(row.getValue("Delivery_date")),
    },
    {
      accessorKey: "Number_ventilation_days",
      id: "Number_ventilation_days",
      filterFn: mulitiFunctionFilter,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Number_ventilation_days" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Cost_total",
      id: "Cost_total",

      filterFn: mulitiFunctionFilter,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Cost_total" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => showCostInTwoDigit(row.getValue("Cost_total")),
    },
    {
      accessorKey: "ID_Hospital",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ID_Hospital" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Department_Admission",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Department_Admission" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Department_Discharge",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Department_Discharge" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "ICD",
      cell: ({ row }) => {
        const ICDText = row.original.ICD_Text;

        const ICDTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.original.ICD}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.original.ICD_Text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        return ICDText ? ICDTextTooltip : <div>{row.getValue("ICD")}</div>;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="ICD" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "DRG",
      cell: ({ row }) => {
        const DRGText = row.original.DRG_Text;

        const DRGTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.original.DRG}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[400px]">{row.original.DRG_Text}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        return DRGText ? DRGTextTooltip : <div>{row.getValue("DRG")}</div>;
      },
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="DRG" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      filterFn: mulitiFunctionFilter,
      accessorKey: "Occupancy_days",
      id: "Occupancy_days",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Occupancy_days" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];
};

export const HospitalDiagnosisColumns = (): ColumnDef<
  HospitalT["diagnosis"]
>[] => {
  const { formatMessage } = useIntl();
  return [
    {
      accessorKey: "ID_type_diagnosis",
      header: formatMessage({ id: "ID_type_diagnosis" }),
    },
    {
      accessorKey: "Type_diagnosis",
      header: formatMessage({ id: "Type_diagnosis" }),
    },
    {
      accessorKey: "ICD_Number",
      header: formatMessage({ id: "ICD_Number" }),
    },
    {
      accessorKey: "ICD_Text",
      header: formatMessage({ id: "ICD_Text" }),
      cell: (ICD_Text) => (
        <div className="w-[400px]">
          {ICD_Text.getValue() as React.ReactNode}
        </div>
      ),
    },
    {
      accessorKey: "Localization_diagnosis",
      header: formatMessage({ id: "Localization_diagnosis" }),
    },

    {
      accessorKey: "Kind_diagnosis",
      header: formatMessage({ id: "Kind_diagnosis" }),
    },
  ];
};

export const HospitalBillingColumns = (): ColumnDef<
  HospitalT["billing"][0]
>[] => {
  const { formatMessage } = useIntl();
  return [
    {
      accessorKey: "Type_fee",
      header: formatMessage({ id: "Type_fee" }),
      cell: ({ row }) => {
        const Fee_Text = row.original.Fee_Text;

        const feeTextTooltip = (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                {row.getValue("Type_fee")}
                <Info className="w-4 h-4 ml-1" />
              </TooltipTrigger>
              <TooltipContent>{Fee_Text as string}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );

        return Fee_Text ? (
          feeTextTooltip
        ) : (
          <div>{row.getValue("Type_fee")}</div>
        );
      },
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
      cell: ({ row }) =>
        showCostInTwoDigit(row.getValue("Total_amount_billed")),
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
      accessorKey: "OPS_Text",
      header: formatMessage({ id: "OPS_Text" }),
      cell: (OPS_Text) => (
        <div className="w-[400px]">
          {OPS_Text.getValue() as React.ReactNode}
        </div>
      ),
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
  return [
    {
      accessorKey: "Hospital_indicator",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Hospital_indicator" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "Start_rehab",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FormattedMessage id="Start_rehab" />

            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
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
      accessorKey: "ICD_Main_Text",
      header: formatMessage({ id: "ICD_Main_Text" }),
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
      accessorKey: "ICD_Primary_Text",
      header: formatMessage({ id: "ICD_Primary_Text" }),
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
      accessorKey: "ICD_Text",
      header: formatMessage({ id: "ICD_Text" }),
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
      cell: ({ row }) => showCostInTwoDigit(row.getValue("Payment_amount")),
    },
  ];
};
