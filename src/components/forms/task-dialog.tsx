import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  PatientT,
  TaskForFormT,
  TaskRelatedToUserT,
  TaskT,
} from "../../../types";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormatDeadline, FormatGender, cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { addTask, updateTaskByTaskId } from "@/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormatDate } from "@/lib/format-date";
import { Separator } from "../ui/separator";

//Add task dialog
// Define a form schema
const formSchema = z.object({
  todo_title: z.string().min(1, { message: "Title ist erforderlich." }),
  related_patient_id: z.string().optional(),
  todo_content: z.string().min(1, { message: "Inhalt ist erforderlich." }),
  todo_deadline: z.date(),
  priority: z.string({
    required_error: "Please select.",
  }),
});

interface Props {
  task?: TaskRelatedToUserT;
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch?: Function;
  queryId?: string;
  patientData?: PatientT;
}

function TaskDialog({
  task,
  open,
  setOpen,
  refetch,
  queryId,
  patientData,
}: Props) {
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
      priority: "low",
      related_patient_id: queryId,
    },
  });
  const { isLoading, mutate } = useMutation({
    mutationFn: (formData: TaskForFormT) =>
      updateTaskByTaskId(formData, task?.todo_id!),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tasksRelatedToUser"] });
    },
  });
  const addNewTask = useMutation({
    mutationFn: (FormData: TaskForFormT) => addTask(FormData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tasksRelatedToUser"] });
    },
  });
  function onSubmit(values: TaskForFormT) {
    if (task) {
      console.log("here on submit");
      console.log(values.todo_deadline);
      const newDeadline = FormatDeadline(values.todo_deadline);
      console.log(newDeadline);
      const newValues = { ...values, todo_deadline: newDeadline };
      mutate(newValues);
      setOpen(false);
    } else {
      const newDeadline = FormatDeadline(values.todo_deadline);
      const newValues = { ...values, todo_deadline: newDeadline };
      addNewTask.mutate(newValues);
      setOpen(false);
      form.reset();
    }
  }
  const { formatMessage } = useIntl();

  const priorities = [
    { label: formatMessage({ id: "Priority_high" }), value: "high" },
    { label: formatMessage({ id: "Priority_medium" }), value: "medium" },
    { label: formatMessage({ id: "Priority_low" }), value: "low" },
  ] as const;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-3xl h-fit flex flex-col">
        {patientData && (
          <div className="w-full flex pr-6">
            <div className="">
              <div className="font-medium flex">
                <FormattedMessage id="ins_id" />:
                <span className="font-light">{patientData?.ins_id}</span>
              </div>{" "}
              <div className="font-medium flex">
                <FormattedMessage id="Date_of_birth" />:{" "}
                <span className="font-light">
                  {" "}
                  {FormatDate(patientData?.Date_of_birth)}
                </span>
              </div>
              
            </div>
            <div className="pl-4">
              {" "}
              <div className="font-medium flex">
                {" "}
                <FormattedMessage id="first_name" />:{" "}
                <span className="font-light">{`${patientData?.first_name}`}</span>
                
              </div>
              <div className="font-medium flex">
                {" "}
                <FormattedMessage id="Name" />:{"      "}
                <span className="font-light">
                  {`    ${patientData?.last_name}`}
                </span>
              </div>
            </div>

            {/* <CardTitle className="mb-1 text-lg">
                <FormattedMessage id="Gender" />:{" "}
                <span className="font-light">
                  {FormatGender(patientData?.Gender)}
                </span>
              </CardTitle>
              <CardTitle className="text-lg">
                <FormattedMessage id="ZIP_code" />:{" "}
                <span className="font-light">{patientData?.ZIP_code}</span>
              </CardTitle> */}
          </div>
        )}
        <AlertDialogHeader className="space-y-0">
          <AlertDialogTitle className="text-xl ">
            {task ? (
              <FormattedMessage id="Task_edit" />
            ) : (
              <FormattedMessage id="Add_task" />
            )}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            className="mt-0 h-full "
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
          >
            <FormField
              control={form.control}
              name="todo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>                      <FormattedMessage id="Title" />
</FormLabel>
                  <FormControl>
                    <Input className="md:h-9" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {!task && (
              <FormField
                control={form.control}
                name="related_patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <FormattedMessage id="ins_id" />
                    </FormLabel>
                    <FormControl>
                      <Input className="md:h-9" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="todo_content"
              render={({ field }) => (
                <FormItem className="mt-3 ">
                  <FormLabel>
                    <FormattedMessage id="Content" />
                  </FormLabel>
                  <FormControl>
                    <Textarea className="xl:h-full lg:h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            {!task ? (
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-3">
                    <FormLabel>
                      <FormattedMessage id="Priority" />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? priorities.find(
                                  (el) => el.value === field.value
                                )?.label
                              : "Select One"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandGroup>
                            {priorities.map((el) => (
                              <CommandItem
                                value={el.label}
                                key={el.value}
                                onSelect={() => {
                                  form.setValue("priority", el.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    el.value == field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {el.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

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
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd.MM.yyyy")
                          ) : (
                            <span>
                              <FormattedMessage id="Date_pick" />
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
