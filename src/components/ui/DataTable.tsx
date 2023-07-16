import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table/table";
import { InsuredT } from "../../../types";

interface DataTableProps {
    columns: { accessor: string; header: string }[];
    data: InsuredT[] | null;
    setSelectedItem: (item: InsuredT) => void;
    selectedItem: InsuredT | null;
}

function PatientsList({
    columns,
    data,
    setSelectedItem,
    selectedItem,
}: DataTableProps) {
    return (
        <div className="rounded-md overflow-hidden border overflow-y-scroll">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.accessor}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data &&
                        data.map((item) => (
                            <TableRow
                                key={item.insuranceNumber}
                                data-state={selectedItem === item && "selected"}
                                onClick={() => setSelectedItem(item)}>
                                {columns.map((column) => (
                                    <TableCell key={column.accessor}>
                                        {
                                            item[
                                                column.accessor as keyof InsuredT
                                            ]
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    {data?.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-full text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default PatientsList;
