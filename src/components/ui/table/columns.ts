import { ColumnDef } from "@tanstack/react-table";
import { InsuredT } from "../../../../types";

export const columns: ColumnDef<InsuredT>[] = [
    { accessorKey: "lastName", header: "Name" },
    { accessorKey: "firstName", header: "Vorname" },
    { accessorKey: "dateOfBirth", header: "Geburtsdatum" },
    { accessorKey: "sex", header: "Geschlecht" },
    { accessorKey: "zipcode", header: "Postleitzahl" },
    { accessorKey: "insuranceNumber", header: "Versichertennummer" },
];

export const columnsData = [
    { accessorKey: "lastName", header: "Name" },
    { accessorKey: "firstName", header: "Vorname" },
    { accessorKey: "dateOfBirth", header: "Geburtsdatum" },
    { accessorKey: "sex", header: "Geschlecht" },
    { accessorKey: "zipcode", header: "Postleitzahl" },
    { accessorKey: "insuranceNumber", header: "Versichertennummer" },
];
