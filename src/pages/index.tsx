import { Inter } from "next/font/google";
import data from "../../mock_insured_patients.json";
import { useMemo, useState } from "react";
import { InsuredT } from "../../types";
import { Input } from "@/components/ui/input";
import { Edit, ArrowDownUp, Search, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShadDataTable } from "@/components/ui/table/ShadDataTable";
import { columns, columnsData } from "@/components/ui/table/columns";

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
            className={`grid px-6 2xl:px-16 pb-4 gap-5 2xl:gap-8 min-h-[calc(100vh-3.5rem)] rounded-md grid-cols-2 ${inter.className}`}>
            <section>
                <div className="mt-5 mb-4 flex w-full justify-between">
                    <Input
                        placeholder="Suchen..."
                        onChange={(event) => setSearchInput(event.target.value)}
                        className="w-40"
                        icon={<Search className="mx-2 h-4 w-4" />}
                    />
                    <div className="flex gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Documentation
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Information eingeben
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Lorem, ipsum dolor sit amet consectetur
                                        adipisicing elit. Ad, delectus!
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea className="h-40" />

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Abbrechen
                                    </AlertDialogCancel>
                                    <AlertDialogAction>
                                        Speichern
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
                                    <b className="ml-1">{headerValue()}</b>
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
            </section>
            <section>
                <Tabs defaultValue={"doctor_information"} className="py-5">
                    <TabsList>
                        <TabsTrigger
                            disabled={!selectedItem}
                            value="doctor_information">
                            Arztdaten
                        </TabsTrigger>
                        <TabsTrigger
                            disabled={!selectedItem}
                            value="medication">
                            Arzneimittel
                        </TabsTrigger>
                        <TabsTrigger
                            disabled={!selectedItem}
                            value="medical_certificates">
                            AU
                        </TabsTrigger>
                        <TabsTrigger
                            disabled={!selectedItem}
                            value="therapeutic_and_aid_supplies">
                            Heil- und Hilfsmittel
                        </TabsTrigger>
                        <TabsTrigger disabled={!selectedItem} value="hospital">
                            Krankenhaus
                        </TabsTrigger>
                        <TabsTrigger disabled={!selectedItem} value="medicines">
                            Medikamente
                        </TabsTrigger>
                        <TabsTrigger
                            disabled={!selectedItem}
                            value="rehabilitation">
                            Reha
                        </TabsTrigger>
                    </TabsList>
                    {selectedItem && (
                        <>
                            <TabsContent value="doctor_information">
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Qui, dolorum ducimus. Quae
                                nesciunt architecto aspernatur corrupti et optio
                                voluptatibus consequuntur dolore laborum
                                cupiditate, alias aut eius, ex reprehenderit
                                perferendis repudiandae. Voluptatibus,
                                necessitatibus, architecto quis quaerat quam
                                asperiores dolor incidunt enim tempora id
                                eligendi maiores voluptatum. Explicabo autem vel
                                vitae tenetur sunt! Architecto ipsa animi
                                officiis nulla velit tempora iusto similique ut
                                id at ullam mollitia, consequuntur molestias
                                laudantium optio, debitis, in rem. Dolorum culpa
                                necessitatibus facere quas quibusdam alias animi
                                obcaecati dolor laudantium blanditiis sunt ipsam
                                autem distinctio omnis fuga, harum nulla
                                mollitia voluptate nostrum esse totam odio.
                                Consectetur distinctio velit, voluptatum
                                provident facilis explicabo quam ut enim
                                architecto quae modi laudantium, inventore vero
                                aperiam molestiae sed necessitatibus deleniti ea
                                pariatur officiis delectus quis? Dicta pariatur,
                                officiis totam fugit aspernatur, est corrupti
                                eaque praesentium culpa dolor delectus tempora
                                aperiam ut. Nemo similique autem impedit magni!
                                Iste laudantium, repellat eius, optio beatae
                                libero incidunt dolorem voluptatum placeat quia
                                sint minus! Blanditiis odio incidunt illum sequi
                                quos consequuntur tempore veritatis labore
                                repellat doloremque quam voluptates reiciendis
                                officiis ab cumque, reprehenderit deserunt
                                animi. Voluptatem, eligendi necessitatibus
                                assumenda itaque non iure eveniet minus fugit
                                error deserunt, et praesentium, ducimus dolorum
                                minima! Harum, esse quos.
                            </TabsContent>
                            <TabsContent value="medication">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Adipisci dolores corporis
                                aliquam mollitia ad accusamus rerum rem
                                perferendis alias animi!
                            </TabsContent>
                            <TabsContent value="medical_certificates">
                                est corrupti eaque praesentium culpa dolor
                                delectus tempora aperiam ut. Nemo similique
                                autem impedit magni! Iste laudantium, repellat
                                eius, optio beatae libero incidunt dolorem
                                voluptatum placeat quia sint minus! Blanditiis
                                odio incidunt illum sequi quos consequuntur
                                tempore veritatis labore repellat doloremque
                                quam voluptates reiciendis officiis ab cumque,
                                reprehenderit deserunt animi. Voluptatem,
                                eligendi necessitatibus assumenda itaque non
                                iure eveniet minus fugit error deserunt, et
                                praesentium, ducimus dolorum minima! Harum, esse
                                quos.
                            </TabsContent>
                            <TabsContent value="therapeutic_and_aid_supplies">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Adipisci dolores corporis
                                aliquam mollitia ad accusamus rerum rem
                                perferendis alias animi!
                            </TabsContent>
                            <TabsContent value="hospital">
                                culpa necessitatibus facere quas quibusdam alias
                                animi obcaecati dolor laudantium blanditiis sunt
                                ipsam autem distinctio omnis fuga, harum nulla
                                mollitia voluptate nostrum esse totam odio.
                                Consectetur distinctio velit, voluptatum
                                provident facilis explicabo quam ut enim
                                architecto quae modi laudantium, inventore vero
                                aperiam
                            </TabsContent>
                            <TabsContent value="medicines">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Adipisci dolores corporis
                                aliquam mollitia ad accusamus rerum rem
                                perferendis alias animi!
                            </TabsContent>
                            <TabsContent value="rehabilitation">
                                reprehenderit deserunt animi. Voluptatem,
                                eligendi necessitatibus assumenda itaque non
                                iure eveniet minus fugit error deserunt, et
                                praesentium, ducimus dolorum minima! Harum, esse
                                quos.
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </section>
        </main>
    );
}
