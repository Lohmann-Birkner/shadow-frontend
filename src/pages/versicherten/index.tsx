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
import {
  getAllPatients,
  getPatientSearchResult,
  getWhichDatabase,
  switchDatabase,
} from "@/api";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SeachPatientMultipleCatalog } from "@/components/searchPatientMultipleCatalog";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  patients: PatientT[];
}
const FormSchema = z.object({
  ten_millions: z.string(),
});

export default function Home({ patients }: Props) {
  const [selectedItem, setSelectedItem] = useState<PatientT | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sortBy, setSortBy] = useState("last_name");
  const [database, setDatabase] = useState("");
  const [searchParameters, setSearchParameters] = useState<searchInputs | null>(
    null
  );
  const { push } = useRouter();
  const PatientColumnsTyped = PatientColumns() as {
    header: string;
    accessorKey: string;
  }[];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data: usedDatabase } = useQuery({
    queryKey: ["database"],
    queryFn: getWhichDatabase,
  });

  console.log(usedDatabase);
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("submitted");
    console.log(data);
    setDatabase(data.ten_millions);

    switchDatabase();
    window.location.reload();
  };
  const { data, isFetching, error } = useQuery({
    queryKey: ["patients", searchParameters, usedDatabase],
    queryFn: () => getPatientSearchResult(searchParameters!),
    initialData: patients,
    enabled: Boolean(searchParameters),
    refetchOnWindowFocus: false,
    cacheTime: 0,
  });

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
            <CardTitle className="flex justify-between">
              <FormattedMessage id="Insured_person" />
              <div>
                {/* <p>You are in {usedDatabase?.active_db.database_name}</p> */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => onSubmit(data))}
                    className="w-auto space-x-6 flex"
                  >
                    <FormField
                      control={form.control}
                      name="ten_millions"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={Intl.NumberFormat(
                                    "de-DE"
                                  ).format(
                                    usedDatabase?.active_db.database_size
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="false">1.000.000</SelectItem>
                              <SelectItem value="true">10.000.000</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <Button type="submit">
                      <FormattedMessage id="switch" />
                    </Button>
                  </form>
                </Form>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-1 md:px-6 h-full">
            <div className="mt-5 mb-4 xl:flex w-full justify-between flex-wrap space-y-4 md:space-y-0 lg:block">
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
export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);
  console.log("---------refresh");
  try {
    const patients = await getAllPatients(session?.authorizationToken);
    return {
      props: {
        patients,
      },
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      props: {
        error: true,
      },
    };
  }
}
