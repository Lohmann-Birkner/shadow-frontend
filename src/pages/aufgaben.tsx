import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, ArrowUpDown, Search, Plus } from "lucide-react";
import { useState } from "react";
import { TasksColumns } from "@/components/ui/table/columns";
import { DataTable } from "@/components/ui/table/data-table";
import { TaskT, TaskRelatedToUserT } from "../../types";
import TaskDialog from "@/components/forms/task-dialog";
import { FormattedMessage } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTaskRelatedToUserById, updateTaskByTaskId } from "@/api";


interface Props {
  userId: number;
  data: TaskRelatedToUserT;
}

function Aufgaben() {
  const [searchInput, setSearchInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskT | null>(null);
  // use useQuery to fetch tasks

  const taskRelatedToUser = useQuery({
    queryKey: ["tasksRelatedToUser"],
    queryFn: () => getTaskRelatedToUserById(),
    enabled: true,
  });
  const tasks = taskRelatedToUser.data as TaskRelatedToUserT[];
  const columns = TasksColumns() as { header: string; accessorKey: string }[];
console.log(taskRelatedToUser.data)
  const headerValue = () => {
    // Find the corresponding header value
    const column = columns.find((column) => column.accessorKey === sortBy);
    const headerValue = column ? column.header : "";
    return headerValue;
  };

  const filteredItems = useMemo(() => {
    if (tasks) {
      const sorted = tasks?.sort((a, b) => {
        switch (sortBy) {
          case "related_patient_id":
            
              const valueA = String(a[sortBy as keyof TaskRelatedToUserT]);
              const valueB = String(b[sortBy as keyof TaskRelatedToUserT]);

              // Add a null/undefined check
              if (valueA === null || valueB === null) {
                  return 0; // Handle the case where the value is null or undefined
              }

              return valueA.localeCompare(valueB);
          
          case "todo_date":
            // Sort by date, newest first
            const dateA = new Date(a.todo_date);
            const dateB = new Date(b.todo_date);
            if (dateA < dateB) {
              return 1;
            } else if (dateA > dateB) {
              return -1;
            } else {
              return 0;
            };
            break;

          case "todo_deadline":
            // sort by deadline, oldest first
            const date1 = new Date(a.todo_deadline);
            const date2 = new Date(b.todo_deadline);
            if (date1 < date2) {
              return 1;
            } else if (date1 > date2) {
              return -1;
            } else {
              return 0;
            };
            break;


          case "done":
            // Sort by done tasks
            return a.done === b.done ? 0 : a.done ? 1 : -1;

          case "priority":
            // Sort by priority, highest first
            const priorityOrder: any = {
              low: 0,
              medium: 1,
              high: 2,
            };
            return priorityOrder[b.priority] - priorityOrder[a.priority];

          case "todo_title":
          case "todo_content":
            // Sort by title and content alphabetically
            return a[sortBy].localeCompare(b[sortBy]);

          default:
            return 0;
        }
      });

      // Filter by searchInput
      const words = searchInput.trim().toLowerCase().split(/\s+/);

      const filteredItems = words.reduce((results, word) => {
        return results.filter(
          (item) =>
            item.todo_title.toLowerCase().includes(word) ||
            item.todo_content.toLowerCase().includes(word) ||
            item.todo_date.toLowerCase().includes(word) ||
            item.todo_deadline.toLowerCase().includes(word)||
            item.related_patient_id.toLowerCase().includes(word)
        );
      }, sorted);

      // Control the flip button
      const flipped = isFlipped ? filteredItems.reverse() : filteredItems;

      return flipped;
    } else return null;
  }, [tasks, sortBy, searchInput, isFlipped]);

  const rowOnClick = (task: TaskT) => {
    setIsDialogOpen(true);
  };

  return (
    <main className="grid grid-cols-1 mt-12 md:mt-16 lg:ml-24 md:px-5">
      <section className="mb-5">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="Task" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="mt-5 mb-4 flex w-full justify-between flex-wrap space-y-4 md:space-y-0">
              <Input
                placeholder="Suchen..."
                onChange={(event) => setSearchInput(event.target.value)}
                className="w-48"
                icon={<Search className="mx-2 h-4 w-4" />}
              />
              <div className="flex gap-3 flex-wrap">
                {/* <Button
                  onClick={() => setIsFlipped(!isFlipped)}
                  variant="outline"
                  className="h-9 md:h-8"
                >
                  {isFlipped ? (
                    <ArrowDownUp className="h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-9 md:h-8" variant="outline">
                      <FormattedMessage id="Sorted_by" />:{" "}
                      <b className="ml-1">{headerValue()}</b>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      {columns
                        .filter((column) => column.accessorKey)
                        .map((column) => (
                          <DropdownMenuRadioItem
                            key={column.accessorKey}
                            value={column.accessorKey}
                          >
                            {column.header}{" "}
                          </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  variant={"outline"}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  <FormattedMessage id="Add_task" />
                </Button>
              </div>
            </div>
            {filteredItems && (
              <DataTable
                data={filteredItems}
                columns={TasksColumns()}
                pagination
                className="h-fit max-h-[45rem]"
              />
            )}
          </CardContent>
        </Card>
      </section>
      {/* here the pop up window is only for adding todo */}
      <TaskDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        refetch={taskRelatedToUser.refetch}
      />
    </main>
  );
}

export default Aufgaben;
