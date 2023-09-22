import { Inter } from "next/font/google";
import { useMemo, useState } from "react";
import { PatientT } from "../../../types";
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
import { DataTable } from "@/components/ui/table/data-table";
import { Columns } from "@/components/ui/table/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { useQuery } from "react-query";
import { getAllPatients } from "@/api";

const inter = Inter({ subsets: ["latin"] });

interface Props {
    patients: PatientT[];
}

export default function Home({ patients }: Props) {
    const [selectedItem, setSelectedItem] = useState<PatientT | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [isFlipped, setIsFlipped] = useState(false);
    const [sortBy, setSortBy] = useState("last_name");

    const { push } = useRouter();
    const insuredColumns = Columns() as {
        header: string;
        accessorKey: string;
    }[];

    const { data } = useQuery({
        queryKey: ["patients"],
        queryFn: getAllPatients,
        initialData: patients,
    });

    const filteredItems = useMemo(() => {
        if (data) {
            let sorted;
            if (sortBy === "Date_of_birth") {
                sorted = data.sort((a, b) => {
                    const dateA = new Date(a.Date_of_birth);
                    const dateB = new Date(b.Date_of_birth);

                    // Compare the dates and return the result
                    if (dateA < dateB) {
                        return 1;
                    } else if (dateA > dateB) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } else {
                sorted = data.sort((a, b) => {
                    const valueA = String(a[sortBy as keyof PatientT]);
                    const valueB = String(b[sortBy as keyof PatientT]);

                    // Add a null/undefined check
                    if (valueA === null || valueB === null) {
                        return 0; // Handle the case where the value is null or undefined
                    }

                    return valueA.localeCompare(valueB);
                });
            }

            // Filter by searchInput
            const words = searchInput.trim().toLowerCase().split(/\s+/);

            const filteredItems = words.reduce((results, word) => {
                return results.filter(
                    (item) =>
                        item.first_name.toLowerCase().startsWith(word) ||
                        item.last_name.toLowerCase().startsWith(word) ||
                        item.Date_of_birth.toLowerCase().includes(word) ||
                        item.Gender.toLowerCase().startsWith(word) ||
                        item.ZIP_code.toLowerCase().startsWith(word) ||
                        item.Insured_person_number.toLowerCase().includes(word)
                );
            }, sorted);

            const flipped = isFlipped ? filteredItems.reverse() : filteredItems;

            return flipped;
        } else return null;
    }, [data, sortBy, searchInput, isFlipped]);

    const headerValue = () => {
        // Find the corresponding header value
        const column = insuredColumns.find(
            (column) => column.accessorKey === sortBy
        );
        const headerValue = column ? column.header : "";
        return headerValue;
    };

    const onRowClick = (insured: PatientT) => {
        setSelectedItem(insured);
        push(`/versicherten/${insured.Insured_person_number}`);
    };

    return (
        <main
            className={`grid grid-cols-1 mt-12 md:mt-16 space-y-4 md:space-y-0 mb-5 lg:ml-24 md:px-5 2xl:px-16 2xl:gap-8  ${inter.className}`}>
            <section className="lg:mr-5 lg:mb-0">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <FormattedMessage id="Insured_person" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 md:px-6">
                        <div className="mt-5 mb-4 flex w-full justify-between flex-wrap space-y-4 md:space-y-0">
                            <Input
                                placeholder="Suchen..."
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                className="w-56"
                                icon={<Search className="mx-2 h-4 w-4" />}
                            />
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    variant="outline"
                                    className="h-9 md:h-8">
                                    {isFlipped ? (
                                        <ArrowDownUp className="h-4 w-4" />
                                    ) : (
                                        <ArrowUpDown className="h-4 w-4" />
                                    )}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-9 md:h-8">
                                            <FormattedMessage id="Sorted_by" />:{" "}
                                            <b className="ml-1">
                                                {headerValue()}
                                            </b>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-48">
                                        <DropdownMenuRadioGroup
                                            value={sortBy}
                                            onValueChange={setSortBy}>
                                            {insuredColumns.map((column) => (
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
                            <DataTable
                                onRowClick={onRowClick}
                                selectedItem={selectedItem}
                                columns={Columns()}
                                data={filteredItems}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>
            {/* <section>
                <Card className="bg-slate-50">
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
            </section> */}
        </main>
    );
}

export async function getStaticProps() {
    const patients = await getAllPatients();
    return { props: { patients }, revalidate: 60 * 3 };
}
