import { Inter } from "next/font/google";
import data from "../../mock_insured_patients.json";
import { useMemo, useState } from "react";
import { InsuredT } from "../../types";
import { Input } from "@/components/ui/input";
import { ArrowDownUp, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShadDataTable } from "@/components/ui/table/data-table";
import { columns, columnsData } from "@/components/ui/table/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [selectedItem, setSelectedItem] = useState<InsuredT | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const [sortBy, setSortBy] = useState("lastName");

    const filteredItems = useMemo(() => {
        if (data) {
            let sorted;
            sortBy === "dateOfBirth"
                ? (sorted = data.sort((a, b) => {
                      const [dayA, monthA, yearA] = a.dateOfBirth
                          .split("-")
                          .map(Number);
                      const [dayB, monthB, yearB] = b.dateOfBirth
                          .split("-")
                          .map(Number);

                      if (yearA !== yearB) {
                          return yearB - yearA;
                      }
                      if (monthA !== monthB) {
                          return monthB - monthA;
                      }
                      return dayB - dayA;
                  }))
                : (sorted = data.sort((a: InsuredT, b: InsuredT) => {
                      return a[sortBy as keyof InsuredT] <
                          b[sortBy as keyof InsuredT]
                          ? -1
                          : a[sortBy as keyof InsuredT] >
                            b[sortBy as keyof InsuredT]
                          ? 1
                          : 0;
                  }));

            // Filter by searchInput
            const words = searchInput.trim().toLowerCase().split(/\s+/);

            const filteredItems = words.reduce((results, word) => {
                return results.filter(
                    (item) =>
                        item.firstName.toLowerCase().startsWith(word) ||
                        item.lastName.toLowerCase().startsWith(word) ||
                        item.dateOfBirth.toLowerCase().includes(word) ||
                        item.sex.toLowerCase().startsWith(word) ||
                        item.zipcode.toLowerCase().startsWith(word) ||
                        item.insuranceNumber.toLowerCase().includes(word)
                );
            }, sorted);

            const flipped = isFlipped ? filteredItems.reverse() : filteredItems;

            return flipped;
        } else return null;
    }, [searchInput, isFlipped, sortBy]);

    const headerValue = () => {
        // Find the corresponding header value
        const column = columnsData.find(
            (column) => column.accessorKey === sortBy
        );
        const headerValue = column ? column.header : "";
        return headerValue;
    };

    return (
        <main
            className={`grid px-5 2xl:px-16 py-6 2xl:gap-8 rounded-md grid-cols-[60%_40%] ${inter.className}`}>
            <section className="mr-5">
                <Card>
                    <CardHeader>
                        <CardTitle>Versicherten</CardTitle>
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
                                            {columnsData.map((column) => (
                                                <DropdownMenuRadioItem
                                                    key={column.header}
                                                    value={column.accessorKey}>
                                                    {column.header}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        {filteredItems && (
                            <ShadDataTable
                                setSelectedItem={setSelectedItem}
                                selectedItem={selectedItem}
                                columns={columns}
                                data={filteredItems}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>
            <section>
                <Card className=" bg-slate-50">
                    <CardHeader>
                        <CardTitle className="text-lg">Lorem ipsum</CardTitle>
                    </CardHeader>
                    <CardContent>
                        dolor sit amet consectetur adipisicing elit. Nulla illum
                        dolore vero ratione velit, reprehenderit deleniti, nisi
                        sequi, dolores optio minus quae cumque similique unde
                        veniam impedit distinctio ducimus delectus fuga nihil
                        molestiae minima provident alias! Rerum ad, repudiandae
                        asperiores ut assumenda non accusantium reiciendis sunt
                        eveniet.
                        <Separator className="my-4" />
                        Delectus ad consectetur dolore! Temporibus nesciunt
                        consequatur quidem facere itaque recusandae assumenda
                        vel beatae minus optio, nobis molestiae ipsam voluptatem
                        nam odio, accusamus velit voluptatum animi tempora
                        soluta est iusto ad. Deleniti nostrum numquam voluptatem
                        nulla atque sunt totam ipsum exercitationem aliquid
                        consequatur voluptatibus possimus, quasi delectus fugit?
                        Tempore, consequatur!
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
