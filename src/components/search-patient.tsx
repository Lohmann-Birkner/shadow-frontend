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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setSearchParameters(data);
    }

    const PatientColumnsTyped = PatientColumns() as {
        header: string;
        accessorKey: string;
    }[];

    return (
        <div className="md:w-1/2">
            <Form {...form}>
                <form
                    className="flex space-x-4"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="catalog"
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        console.log("value", value);
                                    }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {PatientColumnsTyped.map((column) => (
                                            <SelectItem
                                                value={column.accessorKey}
                                                key={column.accessorKey}>
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
                                    <Input
                                        {...field}
                                        placeholder="Suchen..."
                                        className="w-56"
                                        icon={
                                            <Search className="mx-2 h-4 w-4" />
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={isLoading} type="submit">
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isLoading ? "Loading..." : "Search"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
