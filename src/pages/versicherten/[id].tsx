import React, { useState } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
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
import {
    MedicalServiceColumns,
    MedicationColumns,
    TasksColumns,
} from "@/components/ui/table/columns";
import { TaskT } from "../../../types";
import Documentation from "@/components/documentation";
import {
    getPatientById,
    getPatientMedicalService,
    getPatientMedication,
} from "@/api";
import { Loader2 } from "lucide-react";
import { MedicalServiceTable } from "@/components/ui/table/medical-service-table";
import { MedicationsTable } from "@/components/ui/table/medication-table";

const mockDocumentation =
    "reprehenderit deserunt animi. Voluptatem, eligendi necessitatibus assumenda itaque non iure eveniet minus fugit error deserunt, et praesentium, ducimus dolorum minima! Harum, esse quos";

export default function Page() {
    const [tab, setTab] = useState("medical_service");
    const { query } = useRouter();
    const [documentation, setDocumentation] = useState(mockDocumentation);

    const { data } = useQuery(
        "insured",
        () => getPatientById(query.id as string),
        {
            enabled: !!query.id,
        }
    );

    const medicalService = useQuery(
        ["medical_service", tab],
        () => getPatientMedicalService(query.id as string),
        {
            enabled: !!query.id && tab === "medical_service",
        }
    );

    const medication = useQuery(
        ["medication", tab],
        () => getPatientMedication(query.id as string),
        {
            enabled: !!query.id && tab === "medication",
        }
    );

    const tasks = tasksData as TaskT[];
    const columns = TasksColumns() as { header: string; accessorKey: string }[];

    return data ? (
        <main className="grid grid-cols-1 mt-16 lg:ml-24 lg:grid-cols-[25%_75%] px-5 2xl:px-8 2xl:gap-4 h-screen rounded-md">
            <section className="flex flex-col pb-5">
                <Card>
                    {data && (
                        <CardContent className="px-4 py-5">
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Insured_person_number" />:{" "}
                                <span className="font-light">
                                    {data?.Insured_person_number}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Name" />:{" "}
                                <span className="font-light">
                                    {`${data?.last_name} ${data?.first_name}`}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Date_of_birth" />:{" "}
                                <span className="font-light">
                                    {data?.Date_of_birth}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Gender" />:{" "}
                                <span className="font-light">
                                    {data?.Gender}
                                </span>
                            </CardTitle>
                            <CardTitle className="text-lg">
                                <FormattedMessage id="ZIP_code" />:{" "}
                                <span className="font-light">
                                    {data?.ZIP_code}
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
                    value={tab}
                    onValueChange={setTab}
                    className="pb-5 flex flex-col">
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="medical_service">
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

                    <TabsContent className="pt-2" value="medical_service">
                        {medicalService.data ? (
                            medicalService.data.map(
                                (row: any, index: number) => (
                                    <MedicalServiceTable
                                        key={index}
                                        data={[row]}
                                        columns={MedicalServiceColumns()}
                                    />
                                )
                            )
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="medication">
                        {medication.data ? (
                            medication.data.map((row: any, index: number) => (
                                <MedicationsTable
                                    key={index}
                                    data={[row]}
                                    columns={MedicationColumns()}
                                />
                            ))
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
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
                                pagination
                                data={tasks.slice(0, 4)}
                                columns={columns.filter(
                                    (column) =>
                                        column.accessorKey !== "insuranceNumber"
                                )}
                            />
                        )}
                    </CardContent>
                </Card>
            </section>{" "}
        </main>
    ) : (
        <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="h-24 w-24 animate-spin" />
        </div>
    );
}
