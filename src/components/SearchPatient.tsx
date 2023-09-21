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
// import { getPatientSearchResults } from "../api";

interface searchInputs {
  catalog: string;
  input: string;
}

interface Props {
 
  getCatalogAndSearchInput:(searchContent: searchInputs|null) => void;
}

const FormSchema = z.object({
  catalog: z.string({
    required_error: "select a search catalog.",
  }),
});

export default function SearchPatient({getCatalogAndSearchInput }: Props) {

  const [searchingInput,setSearchingInput]=useState<string>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data.catalog)
    console.log(searchingInput)
   
    getCatalogAndSearchInput((data.catalog&&searchingInput)?{catalog:data.catalog,input:searchingInput}:null)
    
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
                      {form.control._formValues.catalog === "Birthday" ? (
                        <input type="date" 
                         onChange={(e)=>setSearchingInput(e.target.value)}
                        />
                      ) : (
                        <Input
                          placeholder="Suchen..."
                           onChange={(event) =>
                            setSearchingInput(event.target.value)
                          }
                          className="w-48 mb-2 mr-2"
                          icon={<Search className="mx-2 h-4 w-4" />}
                        />
                      )}

                      <Button type="submit" >Search</Button>
                    </div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Name">Name</SelectItem>
                    <SelectItem value="Firstname">Vorname</SelectItem>
                    <SelectItem value="Birthday">Geburtsdatum</SelectItem>
                    <SelectItem value="Post">Postleitzahl</SelectItem>

                    <SelectItem value="Insured_person_number">
                      Versichertennummer
                    </SelectItem>
                    <SelectItem value="Gender">Geschlecht</SelectItem>
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
