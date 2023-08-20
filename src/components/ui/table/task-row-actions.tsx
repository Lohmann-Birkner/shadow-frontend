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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "../button";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import { priorities, statuses } from "./columns";
import { useState } from "react";
import { TaskT } from "../../../../types";
import TaskDialog from "@/components/forms/task-dialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const task = row.original as TaskT;
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.done.toString());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");

    const onActionClick = (dialogType: "edit" | "delete") => {
        setDialogType(dialogType);
        setIsDialogOpen(true);
    };

    const dialogDeleteTask = (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Mit dieser Aktion wird Ihre Aufgabe gelöscht
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Absagen</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                        Löschen
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    const dialogEditTask = (
        <TaskDialog open={isDialogOpen} setOpen={setIsDialogOpen} task={task} />
    );

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
                        <DropdownMenuSubTrigger>
                            Priorität
                        </DropdownMenuSubTrigger>
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
                    <DropdownMenuItem
                        onClick={() => onActionClick("edit")}
                        className="flex justify-between">
                        <span>Bearbeiten</span> <Pencil className="w-4 h-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onActionClick("delete")}
                        className="flex justify-between">
                        <span>Löschen</span>
                        <Trash2 className="w-4 h-4" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {dialogType === "edit" ? dialogEditTask : dialogDeleteTask}
        </>
    );
}
