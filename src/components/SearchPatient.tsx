import React from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Search, ArrowUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Props {
  setSearchInput: (data: string) => void;
  searchInput: string;
}

const FormSchema = z.object({
  catalog: z.string({
    required_error: "select a search catalog.",
  }),
});

export default function SearchPatient({ setSearchInput, searchInput }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.catalog);
    console.log(searchInput);
  }
  return (
    <div className="md:w-full lg:w-1/2 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        //   className=" space-y-6"
        >
          <FormField
          
            control={form.control}
            name="catalog"
            render={({ field }) => (
              <FormItem className=" w-full ">
                {/* <FormLabel>Catalog</FormLabel> */}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className=" w-full">
                    <div className="lg:flex lg:justify-start w-full sm:justify-around">
                      <SelectTrigger className="w-44 mb-2 mr-2">
                        <SelectValue placeholder="catalog..." />
                      </SelectTrigger>
                      <Input
                        placeholder="Suchen..."
                        onChange={(event) => setSearchInput(event.target.value)}
                        className="w-48 mb-2 mr-2"
                        icon={<Search className="mx-2 h-4 w-4" />}
                      />
                      <Button type="submit">Search</Button>
                    </div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Name">Name</SelectItem>
                    <SelectItem value="Vorname">Vorname</SelectItem>
                    <SelectItem value="Geburtsdatum">Geburtsdatum</SelectItem>
                    <SelectItem value="Postleitzahl">Postleitzahl</SelectItem>

                    <SelectItem value="Versichertennummer">
                      Versichertennummer
                    </SelectItem>
                    <SelectItem value="Geschlecht">Geschlecht</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          
        </form>
      </Form>
    </div>
  );
}
