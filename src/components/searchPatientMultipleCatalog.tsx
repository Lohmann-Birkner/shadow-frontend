import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormatDeadline, cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { searchInputs } from "../../types";

interface Props {
  setSearchParameters: (searchContent: searchInputs | null) => void;
  isLoading: boolean;
}
const FormSchema = z.object({
  ins_id: z.string().optional(),
  lastname: z.string().optional(),
  firstname: z.string().optional(),
  gender: z.string().optional(),
  postNumber: z.string().optional(),
  dateOfBirthStart: z.date().optional(),
  dateOfBirthEnd: z.date().optional(),
  entryDateStart: z.date().optional(),
  entryDateEnd: z.date().optional(),
});

export function SeachPatientMultipleCatalog({
  setSearchParameters,
  isLoading,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { formatMessage } = useIntl();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ins_id: "",
      lastname: "",
      firstname: "",
      gender: "",
      postNumber: "",
      dateOfBirthStart: undefined,
      dateOfBirthEnd: undefined,
      entryDateStart: undefined,
      entryDateEnd: undefined,
    },
  });

  const genders = [
    { label: formatMessage({ id: "female" }), value: "W" },
    { label: formatMessage({ id: "male" }), value: "M" },
  ] as const;

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log(values.dateOfBirthStart);
    let formatedDateofBirthEnd;
    let formatedDateofBirthStart;
    let formatedEntryDateStart;
    let formatedEntryDateEnd;
    // Do something with the form values.
    // format the date to yyyy-mm-dd, from date to string
    if (values.dateOfBirthEnd) {
      formatedDateofBirthEnd = FormatDeadline(values.dateOfBirthEnd);
    }
    if (values.dateOfBirthStart) {
      formatedDateofBirthStart = FormatDeadline(values.dateOfBirthStart);
    }
    if (values.entryDateStart) {
      formatedEntryDateStart = FormatDeadline(values.entryDateStart);
    }
    if (values.entryDateEnd) {
      formatedEntryDateEnd = FormatDeadline(values.entryDateEnd);
    }

    const newValues = {
      ...values,
      dateOfBirthStart: formatedDateofBirthStart,
      dateOfBirthEnd: formatedDateofBirthEnd,
      entryDateStart: formatedEntryDateStart,
      entryDateEnd: formatedEntryDateEnd,
    } as searchInputs;
    console.log(typeof newValues.dateOfBirthStart);
    setSearchParameters(newValues);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3  flex ">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-[450px] "
        >
          {" "}
          <div className="flex">
            <FormLabel className="pt-2 mr-4 w-[150px]">
              <FormattedMessage id="ins_id" />
            </FormLabel>
            <FormField
              control={form.control}
              name="ins_id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input {...field} className="w-[220px] mb-2 mr-2" />{" "}
                    </>
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>{" "}
          <CollapsibleContent>
            <div className="flex">
              <FormLabel className="pt-2 mr-4 w-[150px]">
                <FormattedMessage id="Firstname" />
              </FormLabel>
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="w-[220px] mb-2 mr-2" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <FormLabel className="pt-2 mr-4 w-[150px]">
                {" "}
                <FormattedMessage id="Last_name" />
              </FormLabel>
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="w-[220px] mb-2 mr-2" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-fit pb-2 mr-4 ">
              <FormLabel className="w-[150px] pt-2 mr-4">
                <FormattedMessage id="Date_of_birth" />
              </FormLabel>
              <FormField
                control={form.control}
                name="dateOfBirthStart"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[220px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>
                                {" "}
                                <FormattedMessage id="date_picker" />
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          fromYear={1900}
                          toYear={Number(new Date().getFullYear())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <p className="mx-4">
                <FormattedMessage id="until" />
              </p>
              <FormField
                control={form.control}
                name="dateOfBirthEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[220px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>
                                {" "}
                                <FormattedMessage id="date_picker" />
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          fromYear={1900}
                          toYear={Number(new Date().getFullYear())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <FormLabel className="pt-2 mr-4 w-[150px]">
                {" "}
                <FormattedMessage id="Gender" />
              </FormLabel>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="w-[220px] mb-2 mr-2">
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[220px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? genders.find(
                                  (gender) => gender.value === field.value
                                )?.label
                              : formatMessage({ id: "select_gender" })}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandGroup>
                            {genders.map((gender) => (
                              <CommandItem
                                value={gender.label}
                                key={gender.value}
                                onSelect={() => {
                                  form.setValue("gender", gender.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    gender.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {gender.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="w-[220px] mb-2 mr-2" />
                    </FormControl>
                  </FormItem>
                )} */}
              {/* /> */}
            </div>
            <div className="flex">
              <FormLabel className="pt-2 mr-4 w-[150px]">PLZ</FormLabel>
              <FormField
                control={form.control}
                name="postNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} className="w-[220px] mb-2 mr-2" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-fit pb-2 mr-4 ">
              <FormLabel className="w-[150px] pt-2 mr-4">
                <FormattedMessage id="Entry_date" />
              </FormLabel>
              <FormField
                control={form.control}
                name="entryDateStart"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[220px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>
                                {" "}
                                <FormattedMessage id="date_picker" />
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          fromYear={1900}
                          toYear={Number(new Date().getFullYear())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <p className="mx-4">
                <FormattedMessage id="until" />
              </p>
              <FormField
                control={form.control}
                name="entryDateEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[220px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>
                                {" "}
                                <FormattedMessage id="date_picker" />
                              </span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          captionLayout="dropdown"
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          fromYear={1900}
                          toYear={Number(new Date().getFullYear())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Button disabled={isLoading} type="submit">
          {" "}
          {/* <FormattedMessage id="search" /> */}
          {isLoading && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : <FormattedMessage id="search" />}
        </Button>
        <Button className="mx-2"
        onClick={() => form.reset({
          ins_id:""
        })}><FormattedMessage id="reset" /></Button>
      </form>
    </Form>
  );
}
