import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, ArrowUpDown, Search } from "lucide-react";
import { useState } from "react";
import { tasksColumns } from "@/components/ui/table/columns";
import data from "../../mock_tasks.json";
import { DataTable } from "@/components/ui/table/data-table";
import { TaskT } from "../../types";

function Aufgaben() {
    const [searchInput, setSearchInput] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const [sortBy, setSortBy] = useState("date");

    const tasks = data as TaskT[];
    const columns = tasksColumns as { header: string; accessorKey: string }[];

    const headerValue = () => {
        // Find the corresponding header value
        const column = columns.find((column) => column.accessorKey === sortBy);
        const headerValue = column ? column.header : "";
        return headerValue;
    };

    const filteredItems = useMemo(() => {
        if (tasks) {
            const sorted = tasks.sort((a, b) => {
                switch (sortBy) {
                    case "date":
                        const dateA = a.date.split("-").reverse().join("-");
                        const dateB = b.date.split("-").reverse().join("-");
                        return (
                            new Date(dateB).getTime() -
                            new Date(dateA).getTime()
                        );

                    case "deadline":
                        const date1 = a.deadline.split("-").reverse().join("-");
                        const date2 = b.deadline.split("-").reverse().join("-");
                        return (
                            new Date(date2).getTime() -
                            new Date(date1).getTime()
                        );

                    case "done":
                        return a.done === b.done ? 0 : a.done ? 1 : -1;

                    case "priority":
                        const priorityOrder = { low: 0, medium: 1, high: 2 };
                        return (
                            priorityOrder[b.priority] -
                            priorityOrder[a.priority]
                        );

                    case "title":
                    case "content":
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
                        item.title.toLowerCase().includes(word) ||
                        item.content.toLowerCase().includes(word) ||
                        item.date.toLowerCase().includes(word) ||
                        item.deadline.toLowerCase().includes(word)
                );
            }, sorted);

            const flipped = isFlipped ? filteredItems.reverse() : filteredItems;

            return flipped;
        } else return null;
    }, [tasks, sortBy, searchInput, isFlipped]);

    return (
        <main className="mt-16 lg:ml-24 px-5">
            <section className="mb-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Aufgaben</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-5 mb-4 flex w-full justify-between">
                            <Input
                                placeholder="Suchen..."
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                className="w-48"
                                icon={<Search className="mx-2 h-4 w-4" />}
                            />
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    variant="outline">
                                    {isFlipped ? (
                                        <ArrowDownUp className="h-4 w-4" />
                                    ) : (
                                        <ArrowUpDown className="h-4 w-4" />
                                    )}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Sortiert nach:{" "}
                                            <b className="ml-1">
                                                {headerValue()}
                                            </b>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48">
                                        <DropdownMenuRadioGroup
                                            value={sortBy}
                                            onValueChange={setSortBy}>
                                            {columns
                                                .filter(
                                                    (column) =>
                                                        column.accessorKey
                                                )
                                                .map((column) => (
                                                    <DropdownMenuRadioItem
                                                        key={column.accessorKey}
                                                        value={
                                                            column.accessorKey
                                                        }>
                                                        {column.header}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        {filteredItems && (
                            <DataTable
                                data={filteredItems}
                                columns={tasksColumns}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}

export default Aufgaben;
