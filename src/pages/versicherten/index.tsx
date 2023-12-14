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
import { getAllPatients, getPatientSearchResult } from "@/api";
import SearchPatient from "@/components/search-patient";
import { getSession, useSession } from "next-auth/react";
import { SeachPatientMultipleCatalog } from "@/components/searchPatientMultipleCatalog";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  patients: PatientT[];
}

export default function Home({ patients }: Props) {
  const [selectedItem, setSelectedItem] = useState<PatientT | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sortBy, setSortBy] = useState("last_name");
  const [searchParameters, setSearchParameters] = useState<searchInputs | null>(
    null
  );

  const { push } = useRouter();
  const PatientColumnsTyped = PatientColumns() as {
    header: string;
    accessorKey: string;
  }[];

  const { data, isFetching, error } = useQuery({
    queryKey: ["patients", searchParameters],
    queryFn: () => getPatientSearchResult(searchParameters!),
    initialData: patients,
    enabled: Boolean(searchParameters),
    refetchOnWindowFocus: false,
  });

  const session = useSession();

  console.log("session data", session.data);

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
    push(`/versicherten/${insured.ins_id}`);
  };

  return (
    <main
      className={`grid grid-cols-1 border-slate-950 mt-8 md:mt-16 space-y-4 md:space-y-0 mb-5 lg:ml-24 md:px-5 2xl:px-5 2xl:gap-8 ${inter.className}`}
    >
      <section className="lg:mr-5 lg:mb-0 ">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="Insured_person"/>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1 md:px-6 h-full">
            <div className="mt-5 mb-4 flex w-full justify-between flex-wrap space-y-4 md:space-y-0">
             
              <SeachPatientMultipleCatalog
                setSearchParameters={setSearchParameters}
                isLoading={isFetching}
              />
              <div className="flex gap-3">
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
                      <FormattedMessage id="Sorted_by" />:{" "}
                      <b className="ml-1">{headerValue()}</b>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuRadioGroup
                      value={sortBy}
                      onValueChange={setSortBy}
                    >
                      {PatientColumnsTyped.map((column) => (
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
            {sortedItems && (
              <div className="">
                <DataTable
                  onRowClick={onRowClick}
                  selectedItem={selectedItem}
                  columns={PatientColumns()}
                  data={sortedItems}
                  pagination
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

// export async function getStaticProps() {
 
 
//   const patients = await getAllPatients();
//   return { props: { patients }, revalidate: 60 * 3 };
// }
export async function getServerSideProps(context:any) {
  const session = await getServerSession(context.req, context.res, authOptions)
  try {
    const patients = await getAllPatients(session?.authorizationToken)
    return {
      props : {
        patients
      }
    }
  } catch(error) {
    console.log('error: ', error)
    return {
      props : {
        error: true
      }
    }
  }  
}
