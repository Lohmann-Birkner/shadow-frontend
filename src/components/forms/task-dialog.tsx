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
import { TaskT } from "../../../types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";

// Define a form schema
const formSchema = z.object({
    title: z.string().min(1, { message: "Title ist erforderlich." }),
    content: z.string().min(1, { message: "Inhalt ist erforderlich." }),
    deadline: z.date(),
});

interface Props {
    task?: TaskT | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

function TaskDialog({ task, open, setOpen }: Props) {
    let defaultDeadline; // Default value for deadline
    if (task) {
        // Parse the date string and create a Date object
        const [day, month, year] = task.deadline.split("-");
        defaultDeadline = new Date(`${year}-${month}-${day}`);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: task ? task.title : "",
            content: task ? task.content : "",
            deadline: defaultDeadline,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        setOpen(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl">
                        {task ? "Aufgabe bearbeiten" : "Aufgabe hinzufügen"}
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <Form {...form}>
                    <form
                        className="mt-4"
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="title"
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
                            name="content"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Inhalt</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mt-3">
                                    <FormLabel>Deadline</FormLabel>
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
                                                            Datum auswählen
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
                                {task ? "Aktualisieren" : "Hinzufügen"}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default TaskDialog;
