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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

const FormSchema = z.object({
  membershipNumber: z.string(),
  lastname: z.string(),
  firstname: z.string(),
  gender: z.string(),
  postNumber: z.string(),
  dateOfBirthStart: z.date(),
  dateOfBirthEnd: z.date(),
  entryDateStart: z.date(),
  entryDateEnd: z.date(),
});

export function SeachPatientMultipleCatalog() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
   
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
              name="membershipNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        
                        {...field}
                        className="w-[220px] mb-2 mr-2"
                      />{" "}
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
                      <Input
                        
                        {...field}
                        className="w-[220px] mb-2 mr-2"
                      />
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
                      <Input
                        
                        {...field}
                        className="w-[220px] mb-2 mr-2"
                      />
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <p className="mx-4">Bis</p>
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                  <FormItem>
                    <FormControl>
                      <Input
                        
                        {...field}
                        className="w-[220px] mb-2 mr-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <FormLabel className="pt-2 mr-4 w-[150px]">PLZ</FormLabel>
              <FormField
                control={form.control}
                name="postNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        
                        {...field}
                        className="w-[220px] mb-2 mr-2"
                      />
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <p className="mx-4">Bis</p>
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
                              <span>Pick a date</span>
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
        <Button type="submit" className="border-2">
        <FormattedMessage id="search" />

        </Button>
      </form>
    </Form>
  );
}
