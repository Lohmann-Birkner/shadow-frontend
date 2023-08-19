import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../button";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { priorities, statuses } from "./columns";
import { useState } from "react";
import { TaskT } from "../../../../types";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const task = row.original as TaskT;
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.done.toString());

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36" align="end">
                <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                            value={status}
                            onValueChange={setStatus}>
                            {statuses.map((status) => (
                                <DropdownMenuRadioItem
                                    key={status.label}
                                    value={status.value.toString()}>
                                    {status.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Priorität</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                            value={priority}
                            onValueChange={(value) =>
                                setPriority(value as TaskT["priority"])
                            }>
                            {priorities.map((status) => (
                                <DropdownMenuRadioItem
                                    key={status.label}
                                    value={status.value}>
                                    {status.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between">
                    <span>Bearbeiten</span> <Pencil className="w-4 h-4" />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex justify-between">
                    <span>Löschen</span>
                    <Trash2 className="w-4 h-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
