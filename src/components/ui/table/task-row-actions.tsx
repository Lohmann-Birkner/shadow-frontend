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
import { Priorities, Statuses } from "./columns";
import { useState } from "react";
import { TaskT,TaskRelatedToUserT } from "../../../../types";
import TaskDialog from "@/components/forms/task-dialog";
import { FormattedMessage } from "react-intl";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as TaskRelatedToUserT;
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.done);
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
          <AlertDialogTitle>
            <FormattedMessage id="Are_you_sure" />
            
          </AlertDialogTitle>
          <AlertDialogDescription>
            <FormattedMessage id="Make_sure_to_delete" />
            
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <FormattedMessage id="Cancel" />
          </AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
            <FormattedMessage id="Aktion_delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const dialogEditTask = (
    <TaskDialog 
    open={isDialogOpen} 
    setOpen={setIsDialogOpen} 
    task={task} 
    
    
    />
  );
  const handleClickForStatus=()=>{

  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36" align="end">
          <DropdownMenuLabel>
            {" "}
            <FormattedMessage id="Aktions" />
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={status.toString()} onValueChange={()=>setStatus(!status)}>
                {Statuses().map((status) => (
                  <DropdownMenuRadioItem
                    key={status.label}
                    value={status.value.toString()}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {" "}
              <FormattedMessage id="Priority" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as TaskT["priority"])
                }
              >
                {Priorities().map((status) => (
                  <DropdownMenuRadioItem
                    key={status.label}
                    value={status.value}
                  >
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onActionClick("edit")}
            className="flex justify-between"
          >
            <span>
              <FormattedMessage id="Aktion_edit" />
            </span>{" "}
            <Pencil className="w-4 h-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onActionClick("delete")}
            className="flex justify-between"
          >
            <span>
              {" "}
              <FormattedMessage id="Aktion_delete" />
            </span>
            <Trash2 className="w-4 h-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogType === "edit" ? dialogEditTask : dialogDeleteTask}
    </>
  );
}
