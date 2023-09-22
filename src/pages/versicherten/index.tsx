import { Inter } from "next/font/google";
import { useMemo, useState, useEffect } from "react";
import { InsuredPersonT } from "../../../types";
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
import { columns } from "@/components/ui/table/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import SearchPatient from "@/components/SearchPatient";
import { getInsuredPersonSearchResults, getInsuredPerson } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { serialize } from "v8";

const inter = Inter({ subsets: ["latin"] });

interface searchInputs {
  catalog: string;
  input: string;
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<InsuredPersonT | null>(null);
  // const [searchInput, setSearchInput] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [sortBy, setSortBy] = useState("Lastname");
  const [searchParameters, setSearchParameters] = useState<searchInputs | null>(null);

  //get insured persons
  const { data, refetch } = useQuery({
    queryKey: ["insuredPersons"],
    queryFn: () => searchParameters?getInsuredPersonSearchResults(searchParameters.catalog, searchParameters.input):getInsuredPerson(),
  });

  const { push } = useRouter();
  const insuredColumns = columns as { header: string; accessorKey: string }[];

  const headerValue = () => {
    // Find the corresponding header value
    const column = insuredColumns.find(
      (column) => column.accessorKey === sortBy
    );
    const headerValue = column ? column.header : "";
    return headerValue;
  };

  const onRowClick = (insured: InsuredPersonT) => {
    setSelectedItem(insured);
    push(`/versicherten/${insured.Insured_person_number}`);
  };

  const getCatalogAndSearchInput = (searchContent: searchInputs | null) => {
    setSearchParameters(searchContent);
    console.log(searchParameters);
  };

   useEffect(() => {
     refetch();
   }, [searchParameters])

  const filteredItems = useMemo(() => {
    if (data) {
      switch(sortBy) {
        case "Date_of_birth":
        case "Entry_date":
        case "Discharge_date":
          data.sort((a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime());
          break;
        case "Membership_number":
        case "Person_indicator":
          data.sort((a, b) => b[sortBy] - a[sortBy]);
          break;
        default:
          data.sort((a, b) => {
            return (a[sortBy as keyof InsuredPersonT] as string)?.localeCompare(
              (b[sortBy as keyof InsuredPersonT] as string)
            );
          });
      }

      if(isFlipped){
        data.reverse();
      }

      return data;
    } else {
      return null;
    }
  }, [isFlipped, sortBy,data]);

  return (
    <main
      className={`grid grid-cols-1 mt-12 md:mt-16 space-y-4 md:space-y-0 lg:grid-cols-[65%_35%] mb-5 lg:ml-24 md:px-5 2xl:px-16 2xl:gap-8  ${inter.className}`}
    >
      <section className="lg:mr-5 lg:mb-0">
        <Card>
          <p>{filteredItems&&JSON.stringify(filteredItems[0].Date_of_birth)}</p>
          <CardHeader>
            <CardTitle>Versicherten</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className=" mt-5 mb-4 lg:flex lg:justify-between w-full space-y-4 md:space-y-0  gap-3
            ">
              <SearchPatient
                getCatalogAndSearchInput={getCatalogAndSearchInput}
              />
              <div className="flex gap-3 w-1/3 lg:justify-end">
                <Button
                  onClick={() => setIsFlipped(!isFlipped)}
                  variant="outline"
                  className="h-9 md:h-8"
                >
                  {isFlipped ? (
                    <ArrowDownUp className="h-4 w-4" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 md:h-8">
                      Sortiert nach: <b className="ml-1">{headerValue()}</b>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      {insuredColumns.map((column) => (
                        <DropdownMenuRadioItem
                          key={column.header}
                          value={column.accessorKey}
                        >
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
                columns={columns}
                data={filteredItems}
              />
            )}
          </CardContent>
        </Card>
      </section>
      <section>
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-lg">Lorem ipsum</CardTitle>
          </CardHeader>
          <CardContent>
            dolor sit amet consectetur adipisicing elit. Nulla illum dolore vero
            ratione velit, reprehenderit deleniti, nisi sequi, dolores optio
            minus quae cumque similique unde veniam impedit distinctio ducimus
            delectus fuga nihil molestiae minima provident alias! Rerum ad,
            repudiandae asperiores ut assumenda non accusantium reiciendis sunt
            eveniet.
            <Separator className="my-4" />
            Delectus ad consectetur dolore! Temporibus nesciunt consequatur
            quidem facere itaque recusandae assumenda vel beatae minus optio,
            nobis molestiae ipsam voluptatem nam odio, accusamus velit
            voluptatum animi tempora soluta est iusto ad. Deleniti nostrum
            numquam voluptatem nulla atque sunt totam ipsum exercitationem
            aliquid consequatur voluptatibus possimus, quasi delectus fugit?
            Tempore, consequatur!
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
