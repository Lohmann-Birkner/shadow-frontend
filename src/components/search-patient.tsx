import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { searchInputs } from "../../types";
import { PatientColumns } from "./ui/table/columns";
import { useIntl } from "react-intl";

interface Props {
  setSearchParameters: (searchContent: searchInputs | null) => void;
  isLoading: boolean;
}

const FormSchema = z.object({
  catalog: z.string({
    required_error: "Search catalog is required",
  }),
  searchQuery: z.string({
    required_error: "Search term is required",
  }),
});

export default function SearchPatient({
  setSearchParameters,
  isLoading,
}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  const [seletedCatalog, setSeletedCatalog] = useState("");
  const { formatMessage } = useIntl();

  function onSubmit(data: z.infer<typeof FormSchema>) {
  }

  const PatientColumnsTyped = PatientColumns() as {
    header: string;
    accessorKey: string;
  }[];

  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({ searchQuery: "", catalog: seletedCatalog });
    }
  }, [form, form.formState, form.reset]);
  

  return (
    <div className="md:w-1/2">
      <Form {...form}>
        <form className="flex space-x-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="catalog"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSeletedCatalog(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-[220px] mb-2 mr-2">
                      <SelectValue
                        className="w-48 mb-2 mr-2 border-black"
                        placeholder={formatMessage({
                          id: "Select_a_catalog",
                        })}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PatientColumnsTyped.map((column) => (
                      <SelectItem
                        value={column.accessorKey}
                        key={column.accessorKey}
                      >
                        {column.header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="searchQuery"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {seletedCatalog === "Date_of_birth" ||
                  seletedCatalog === "Entry_date" ||
                  seletedCatalog === "Discharge_date" ? (
                    <Input
                      {...field}
                      type="date"
                      className="w-48 mb-2 mr-2"
                      icon={<Search className="mx-2 h-4 w-4" />}
                    />
                  ) : (
                    <Input
                      {...field}
                      placeholder="Suchen..."
                      className="w-48 mb-2 mr-2"
                      icon={<Search className="mx-2 h-4 w-4" />}
                    />
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
