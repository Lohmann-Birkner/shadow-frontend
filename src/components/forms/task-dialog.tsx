import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TaskForFormT, TaskRelatedToUserT, TaskT } from "../../../types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormatDeadline, cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { FormattedMessage } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { updateTaskByTaskId } from "@/api";

// Define a form schema
const formSchema = z.object({
    todo_title: z.string().min(1, { message: "Title ist erforderlich." }),
    todo_content: z.string().min(1, { message: "Inhalt ist erforderlich." }),
    todo_deadline: z.date(),
});

interface Props {

  task?: TaskRelatedToUserT;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch?: Function;
}

function TaskDialog({ task, open, setOpen, refetch }: Props) {
  const queryClient = useQueryClient();

  let defaultDeadline; // Default value for deadline
  if (task) {
    // Parse the date string and create a Date object
    const [year, month, day] = task.todo_deadline.split("-");
    defaultDeadline = new Date(`${year}-${month}-${day}`);
  }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            todo_title: task ? task.todo_title : "",
            todo_content: task ? task.todo_content : "",
            todo_deadline: defaultDeadline,
        },
    });
    const { isLoading, mutate } = useMutation({
        mutationFn: (formData: TaskForFormT) =>
            updateTaskByTaskId(formData, task?.todo_id!),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["tasksRelatedToUser"] });
        },
    });


    function onSubmit(values: TaskForFormT) {
        console.log("here on submit");
        console.log(values.todo_deadline);
        const newDeadline = FormatDeadline(values.todo_deadline);
        const newValues = { ...values, todo_deadline: newDeadline };
        mutate(newValues);
        setOpen(false);
    }


    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">
                        {task ? (
                            <FormattedMessage id="Task_edit" />
                        ) : (
                            <FormattedMessage id="Add_task" />
                        )}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form
                        className="mt-4"
                        onSubmit={form.handleSubmit((data) => onSubmit(data))}>
                        <FormField
                            control={form.control}
                            name="todo_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input className="md:h-9" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="todo_content"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>
                                        <FormattedMessage id="Content" />
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="todo_deadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-3">
                                    <FormLabel>
                                        <FormattedMessage id="Deadline" />
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value &&
                                                            "text-muted-foreground"
                                                    )}>
                                                    {field.value ? (
                                                        format(
                                                            field.value,
                                                            "dd-MM-yyyy"
                                                        )
                                                    ) : (
                                                        <span>
                                                            <FormattedMessage id="Date_pick" />
                                                        </span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <AlertDialogFooter className="mt-8">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="submit">
                                {task ? (
                                    <FormattedMessage id="Update" />
                                ) : (
                                    <FormattedMessage id="Add" />
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default TaskDialog;
