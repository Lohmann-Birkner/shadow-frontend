import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getInsured } from "@/api";
import { FormattedMessage } from "react-intl";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/table/data-table";
import tasksData from "../../../mock_tasks.json";
import { TasksColumns } from "@/components/ui/table/columns";
import { TaskT } from "../../../types";
import Documentation from "@/components/documentation";

const mockDocumentation =
    "reprehenderit deserunt animi. Voluptatem, eligendi necessitatibus assumenda itaque non iure eveniet minus fugit error deserunt, et praesentium, ducimus dolorum minima! Harum, esse quos";

export default function Page() {
    const { query } = useRouter();
    const [documentation, setDocumentation] = useState(mockDocumentation);

    const { data } = useQuery("insured", () => getInsured(query.id as string), {
        enabled: !!query.id,
    });
    const tasks = tasksData as TaskT[];
    const columns = TasksColumns() as { header: string; accessorKey: string }[];

    return (
        <main className="grid grid-cols-1 mt-16 lg:ml-24 lg:grid-cols-[25%_75%] px-5 2xl:px-16 2xl:gap-8 h-screen rounded-md">
            <section className="flex flex-col pb-5">
                <Card>
                    {data && (
                        <CardContent className="px-4 py-5">
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Insured_person_number" />:{" "}
                                <span className="font-light">
                                    {data?.insuranceNumber}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Name" />:{" "}
                                <span className="font-light">
                                    {`${data?.lastName} ${data?.firstName}`}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Date_of_birth" />:{" "}
                                <span className="font-light">
                                    {data?.dateOfBirth}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Gender" />:{" "}
                                <span className="font-light">{data?.sex}</span>
                            </CardTitle>
                            <CardTitle className="text-lg">
                                <FormattedMessage id="ZIP_code" />:{" "}
                                <span className="font-light">
                                    {data?.zipcode}
                                </span>
                            </CardTitle>
                        </CardContent>
                    )}
                </Card>
                <Documentation
                    data={documentation}
                    setData={setDocumentation}
                />
            </section>
            <section className="lg:ml-4 pb-5">
                <Tabs
                    defaultValue={"doctor_information"}
                    className="pb-5 flex flex-col">
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="doctor_information">
                            <FormattedMessage id="Doctor_Data" />
                        </TabsTrigger>

                        <TabsTrigger value="medication">
                            <FormattedMessage id="Medication" />
                        </TabsTrigger>

                        <TabsTrigger value="medical_certificates">
                            <FormattedMessage id="medical_certificates" />
                        </TabsTrigger>

                        <TabsTrigger value="therapeutic_and_aid_supplies">
                            <FormattedMessage id="Therapeutic_and_aid_supplies" />
                        </TabsTrigger>
                        <TabsTrigger value="hospital">
                            <FormattedMessage id="Hospital" />
                        </TabsTrigger>

                        <TabsTrigger value="rehabilitation">
                            <FormattedMessage id="Rehabilitation" />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent className="pt-2" value="doctor_information">
                        <Tabs defaultValue={"tab1"}>
                            <TabsList className=" bg-transparent">
                                <TabsTrigger
                                    className="data-[state=active]:shadow-none"
                                    value="tab1">
                                    Tab 1
                                </TabsTrigger>
                                <TabsTrigger
                                    className="data-[state=active]:shadow-none"
                                    value="tab2">
                                    Tab 2
                                </TabsTrigger>
                                <TabsTrigger
                                    className="data-[state=active]:shadow-none"
                                    value="tab3">
                                    Tab 3
                                </TabsTrigger>
                            </TabsList>
                            <Separator className="px-4" />
                            <TabsContent
                                className="border-none m-0"
                                value="tab1">
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
                            </TabsContent>
                            <TabsContent
                                className="border-none m-0"
                                value="tab2">
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Qui, dolorum ducimus. Quae
                                nesciunt architecto aspernatur corrupti et optio
                                voluptatibus consequuntur dolore laborum
                                cupiditate, alias aut eius, ex reprehenderit
                                perferendis repudiandae. Voluptatibus,
                                necessitatibus, architecto quis quaerat quam vel
                                vitae tenetur sunt! Architecto ipsa animi
                                necessitatibus facere quas quibusdam alias animi
                                obcaecati dolor laudantium blanditiis sunt ipsam
                                autem distinctio omnis fuga, harum nulla
                                mollitia voluptate nostrum esse totam odio.
                                Consectetur distinctio velit, voluptatum
                                provident facilis explicabo quam ut enim
                                architecto quae modi laudantium, inventore vero
                            </TabsContent>
                            <TabsContent
                                className="border-none m-0"
                                value="tab3">
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
                            </TabsContent>
                        </Tabs>
                    </TabsContent>
                    <TabsContent value="medication">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent value="medical_certificates">
                        est corrupti eaque praesentium culpa dolor delectus
                        tempora aperiam ut. Nemo similique autem impedit magni!
                        Iste laudantium, repellat eius, optio beatae libero
                        incidunt dolorem voluptatum placeat quia sint minus!
                        Blanditiis odio incidunt illum sequi quos consequuntur
                        tempore veritatis labore repellat doloremque quam
                        voluptates reiciendis officiis ab cumque, reprehenderit
                        deserunt animi. Voluptatem, eligendi necessitatibus
                        assumenda itaque non iure eveniet minus fugit error
                        deserunt, et praesentium, ducimus dolorum minima! Harum,
                        esse quos.
                    </TabsContent>
                    <TabsContent value="therapeutic_and_aid_supplies">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent value="hospital">
                        culpa necessitatibus facere quas quibusdam alias animi
                        obcaecati dolor laudantium blanditiis sunt ipsam autem
                        distinctio omnis fuga, harum nulla mollitia voluptate
                        nostrum esse totam odio. Consectetur distinctio velit,
                        voluptatum provident facilis explicabo quam ut enim
                        architecto quae modi laudantium, inventore vero aperiam
                    </TabsContent>
                    <TabsContent value="medicines">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent value="rehabilitation">
                        reprehenderit deserunt animi. Voluptatem, eligendi
                        necessitatibus assumenda itaque non iure eveniet minus
                        fugit error deserunt, et praesentium, ducimus dolorum
                        minima! Harum, esse quos.
                    </TabsContent>
                </Tabs>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl mb-3">
                            <FormattedMessage id="Tasks" />
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {tasks && (
                            <DataTable
                                data={tasks.slice(0, 4)}
                                columns={columns.filter(
                                    (column) =>
                                        column.accessorKey !== "insuranceNumber"
                                )}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
