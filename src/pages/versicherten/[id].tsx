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
import { DataTable } from "@/components/ui/table/data-table";
import tasksData from "../../../mock_tasks.json";
import {
    HospitalColumns,
    MedaidColumns,
    MedicalServiceColumns,
    MedicationColumns,
    RehabColumns,
    TasksColumns,
    WorkInabilityPaymentsColumns,
} from "@/components/ui/table/columns";
import { TaskT, WorkInabilityT } from "../../../types";
import Documentation from "@/components/documentation";
import {
    getPatientById,
    getPatientHospital,
    getPatientMedaid,
    getPatientMedicalService,
    getPatientMedication,
    getPatientRehab,
    getPatientWorkInability,
} from "@/api";
import { Loader2 } from "lucide-react";
import { MedicalServiceTable } from "@/components/ui/table/medical_service_table";
import { MedicationTable } from "@/components/ui/table/medication-table";
import { WorkInabilityTable } from "@/components/ui/table/work-inability-table";
import { MadaidTable } from "@/components/ui/table/medaid-table";
import { HospitalTable } from "@/components/ui/table/hospital-table";
import { RehabTable } from "@/components/ui/table/rehab-table";
import { FormatDate } from "@/lib/format-date";
import { FormatGender} from "@/lib/utils";

export default function Page() {
    const [tab, setTab] = useState("medical_service");
    const { query } = useRouter();
    const [documentation, setDocumentation] = useState("");

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

    const workInability = useQuery(
        ["work_inability", tab],
        () => getPatientWorkInability(query.id as string),
        {
            enabled: !!query.id && tab === "work_inability",
        }
    );

    const mappedWorkInability = (data: WorkInabilityT[]) => {
        const mappedData = data.flatMap((icd) => {
            const Main_ICD = icd.Main_ICD;
            return icd.payments.map((payment) => {
                return { ...payment, Main_ICD };
            });
        });
        return mappedData;
    };

    const medaid = useQuery(
        ["medaid", tab],
        () => getPatientMedaid(query.id as string),
        {
            enabled: !!query.id && tab === "therapeutic_and_aid_supplies",
        }
    );

    const hospital = useQuery(
        ["hospital", tab],
        () => getPatientHospital(query.id as string),
        {
            enabled: !!query.id && tab === "hospital",
        }
    );

    const rehab = useQuery(
        ["rehab", tab],
        () => getPatientRehab(query.id as string),
        {
            enabled: !!query.id && tab === "rehab",
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
                                    {FormatDate(data?.Date_of_birth)}
                                </span>
                            </CardTitle>
                            <CardTitle className="mb-1 text-lg">
                                <FormattedMessage id="Gender" />:{" "}
                                <span className="font-light">
                                    {FormatGender(data?.Gender)}
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
                    className="pb-5 flex flex-col ">
                    <TabsList className="flex-wrap  flex  ">
                        <TabsTrigger value="medical_service">
                            <FormattedMessage id="Doctor_Data" />
                        </TabsTrigger>

                        <TabsTrigger value="medication">
                            <FormattedMessage id="Medication" />
                        </TabsTrigger>

                        <TabsTrigger value="work_inability">
                            <FormattedMessage id="work_inability" />
                        </TabsTrigger>

                        <TabsTrigger value="therapeutic_and_aid_supplies">
                            <FormattedMessage id="Therapeutic_and_aid_supplies" />
                        </TabsTrigger>
                        <TabsTrigger value="hospital">
                            <FormattedMessage id="Hospital" />
                        </TabsTrigger>

                        <TabsTrigger value="rehab">
                            <FormattedMessage id="Rehabilitation" />
                        </TabsTrigger>
                        <TabsTrigger value="tasks">
                            <FormattedMessage id="Tasks" />
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        className="p-0 border-0 h-[45rem] max-h-[45rem] "
                        value="medical_service">
                        {medicalService.data ? (
                            <MedicalServiceTable
                                data={medicalService.data}
                                columns={MedicalServiceColumns()}
                                pagination
                            />
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin " />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent
                        className="p-0 h-[45rem] border-0"
                        value="medication">
                        {medication.data ? (
                            <MedicationTable
                                data={medication.data}
                                columns={MedicationColumns()}
                                pagination
                                className="border-red-100 overflow-x-auto"
                            />
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent
                        className="p-0 h-[45rem] border-0"
                        value="work_inability">
                        {workInability.data ? (
                            workInability.data.length > 0 ? (
                                <div className=" p-4 ">
                                    <WorkInabilityTable
                                        data={mappedWorkInability(
                                            workInability.data
                                        )} // Pass the current item to the table
                                        columns={WorkInabilityPaymentsColumns()}
                                        pagination
                                    />
                                </div>
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <FormattedMessage id="No_results" />
                                </div>
                            )
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent
                        className="p-0 h-[45rem] border-0"
                        value="therapeutic_and_aid_supplies">
                        {medaid.data ? (
                            medaid.data.length > 0 ? (
                                <MadaidTable
                                    data={medaid.data}
                                    columns={MedaidColumns()}
                                    pagination
                                />
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <FormattedMessage id="No_results" />
                                </div>
                            )
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent
                        className="p-0 h-[45rem] border-0 rounded-md"
                        value="hospital">
                        {hospital.data ? (
                            hospital.data.length > 0 ? (
                                <HospitalTable
                                    data={hospital.data}
                                    columns={HospitalColumns()}
                                    pagination
                                />
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <FormattedMessage id="No_results" />
                                </div>
                            )
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent
                        className="p-0 h-[45rem] border-0"
                        value="rehab">
                        {rehab.data ? (
                            rehab.data.length > 0 ? (
                                <RehabTable
                                    data={rehab.data}
                                    columns={RehabColumns()}
                                    pagination
                                />
                            ) : (
                                <div className="w-full flex justify-center items-center">
                                    <FormattedMessage id="No_results" />
                                </div>
                            )
                        ) : (
                            <div className="w-full flex justify-center items-center">
                                <Loader2 className="h-16 w-16 m-5 animate-spin" />
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent className="p-5" value="tasks">
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
                    </TabsContent>
                </Tabs>
            </section>{" "}
        </main>
    ) : (
        <div className="w-screen h-screen flex justify-center items-center">
            <Loader2 className="h-24 w-24 animate-spin" />
        </div>
    );
}
