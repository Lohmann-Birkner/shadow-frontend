import { Inter } from "next/font/google";
import { useMemo, useState } from "react";
import { PatientT, searchInputs } from "../../../types";
import { ArrowDownUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/table/data-table";
import { PatientColumns } from "@/components/ui/table/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import { useQuery } from "react-query";
import { getAllPatients, getPatientByQuery } from "@/api";
import SearchPatient from "@/components/search-patient";

const inter = Inter({ subsets: ["latin"] });

interface Props {
    patients: PatientT[];
}

export default function Home({ patients }: Props) {
    const [selectedItem, setSelectedItem] = useState<PatientT | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sortBy, setSortBy] = useState("last_name");
    const [searchParameters, setSearchParameters] =
        useState<searchInputs | null>(null);

    const { push } = useRouter();
    const PatientColumnsTyped = PatientColumns() as {
        header: string;
        accessorKey: string;
    }[];

    const { data, isFetching } = useQuery({
        queryKey: ["patients"],
        queryFn: () => getPatientByQuery(searchParameters!),
        initialData: patients,
        enabled: Boolean(searchParameters),
    });

    // const { data } = useQuery({
    //     queryKey: ["patients"],
    //     queryFn: getAllPatients,
    //     initialData: patients,
    // });

    const sortedItems = useMemo(() => {
        if (data) {
            let sortedData;

            switch (sortBy) {
                case "Date_of_birth":
                case "Entry_date":
                case "Discharge_date":
                    sortedData = [...data].sort((a, b) => {
                        const dateA = new Date(a[sortBy]);
                        const dateB = new Date(b[sortBy]);
                        if (dateA < dateB) {
                            return 1;
                        } else if (dateA > dateB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    break;
                default:
                    sortedData = [...data].sort((a, b) => {
                        const valueA = String(a[sortBy as keyof PatientT]);
                        const valueB = String(b[sortBy as keyof PatientT]);

                        // Add a null/undefined check
                        if (valueA === null || valueB === null) {
                            return 0; // Handle the case where the value is null or undefined
                        }

                        return valueA.localeCompare(valueB);
                    });
            }

            // Reverse the sorted data if isFlipped is true
            if (isFlipped) {
                sortedData.reverse();
            }

            return sortedData;
        }

        return data;
    }, [data, sortBy, isFlipped]);

    const headerValue = () => {
        // Find the corresponding header value
        const column = PatientColumnsTyped.find(
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
                            <SearchPatient
                                setSearchParameters={setSearchParameters}
                                isLoading={isFetching}
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
                                            {PatientColumnsTyped.map(
                                                (column) => (
                                                    <DropdownMenuRadioItem
                                                        key={column.header}
                                                        value={
                                                            column.accessorKey
                                                        }>
                                                        {column.header}
                                                    </DropdownMenuRadioItem>
                                                )
                                            )}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        {sortedItems && (
                            <DataTable
                                onRowClick={onRowClick}
                                selectedItem={selectedItem}
                                columns={PatientColumns()}
                                data={sortedItems}
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
