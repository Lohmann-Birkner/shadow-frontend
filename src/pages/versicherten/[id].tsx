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
import {
  HospitalColumns,
  MedaidColumns,
  MedicalServiceColumns,
  MedicationColumns,
  RehabColumns,
  TasksColumns,
  WorkInabilityColumns,
} from "@/components/ui/table/columns";
import Documentation from "@/components/documentation";
import {
  getDocumentById,
  getPatientById,
  getPatientHospital,
  getPatientMedaid,
  getPatientMedicalService,
  getPatientMedication,
  getPatientRehab,
  getPatientWorkInability,
  getTaskRelatedToUserById,
  getTaskRelatedToPatient,
} from "@/api";
import { Loader2, ChevronsRight, ChevronsLeft } from "lucide-react";
import { MedicalServiceTable } from "@/components/ui/table/medical_service_table";
import { MedicationTable } from "@/components/ui/table/medication-table";
import { WorkInabilityTable } from "@/components/ui/table/work-inability-table";
import { MadaidTable } from "@/components/ui/table/medaid-table";
import { HospitalTable } from "@/components/ui/table/hospital-table";
import { RehabTable } from "@/components/ui/table/rehab-table";
import { FormatDate } from "@/lib/format-date";
import { FormatGender, cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { getSession, useSession } from "next-auth/react";
import { TaskRelatedToUserT } from "../../../types";
import AufgabeRelatedToPatient from "@/components/ui/table/aufgabeRelatedToPatient";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const { query } = useRouter();
  const { data } = useQuery(
    "insured",
    () => getPatientById(query.id as string),
    {
      enabled: !!query.id,
    }
  );
  const [tab, setTab] = useState("task");
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
  // const mappedHospital=()=>{
  //   hospital?.data?.map((data)=>{
  // data.diagnosis.map((diagnose)=>{
  //   diagnose.
  // })
  //   })
  // }

  const rehab = useQuery(
    ["rehab", tab],
    () => getPatientRehab(query.id as string),
    {
      enabled: !!query.id && tab === "rehab",
    }
  );
  // const tasks = tasksData as TaskT[];
  const columns = TasksColumns();
  const columnsRelatedToPatient = TasksColumns().slice(1);
  const taskRelatedToPatient = useQuery(
    ["tasksRelatedToUser", tab, query.id],
    () => getTaskRelatedToUserById(query.id as string),
    { enabled: true }
  );
  const tasks = taskRelatedToPatient.data as TaskRelatedToUserT[];

  return data ? (
    <>
      <main className="mt-16 lg:flex lg:justify-start lg:grid-cols-[25%_75%] lg:ml-24 px-5 2xl:px-8 2xl:gap-1 rounded-md">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className={cn("space-y-2",isOpen&& "w-[300px] lg:w-[300px] md:w-full  ")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className=" p-0 border-2 mb-2">
              {isOpen ? (
                <ChevronsLeft className="h-4 w-4" />
              ) : (
                <ChevronsRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 lg:w-max-[300px]  ">
            <section className="h-2/3 md:flex md:justify-stretch	 lg:block">
              <Card className="rounded-md w-full md:mr-3 md:h-fit">
                {data && (
                  <CardContent className="px-4 pt-4 ">
                    <CardTitle className="mb-1 text-lg">
                      <FormattedMessage id="ins_id" />:{" "}
                      <span className="font-light">{data?.ins_id}</span>
                    </CardTitle>
                    <CardTitle className="mb-1 text-lg">
                      <FormattedMessage id="Name" />:{" "}
                      <span className="font-light">{`${data?.last_name}`}</span>
                    </CardTitle>
                    <CardTitle className="mb-1 text-lg">
                      <FormattedMessage id="first_name" />:{" "}
                      <span className="font-light">
                        {`${data?.first_name}`}
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
                      <span className="font-light">{data?.ZIP_code}</span>
                    </CardTitle>
                  </CardContent>
                )}
              </Card>

              <Documentation queryId={query.id} patientData={data} />
            </section>
          </CollapsibleContent>
        </Collapsible>
        <section
          className={cn(
            "lg:ml-4 pb-5 lg:w-4/5 ",
            !isOpen && "w-full lg:w-11/12"
          )}
        >
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="pb-5 flex flex-col h-full"
          >
            {!isOpen && (
              <div className="border-b-2 text-center  ">
                {" "}
                <CardContent className="px-1 py-1 flex ">
                  <CardTitle className="mb-1 pl-0 pr-4 text-lg text-start">
                    <FormattedMessage id="ins_id" />:{" "}
                    <span className="font-light ">{data?.ins_id}</span>
                  </CardTitle>
                  <CardTitle className="mb-1 text-lg px-4 text-start">
                    <FormattedMessage id="Name" />:{" "}
                    <span className="font-light">{`${data?.last_name} `}</span>
                  </CardTitle>
                  <CardTitle className="mb-1 text-lg px-4 text-start">
                    <FormattedMessage id="first_name" />:{" "}
                    <span className="font-light">{` ${data?.first_name}`}</span>
                  </CardTitle>
                  <CardTitle className="mb-1 text-lg px-4 text-start">
                    <FormattedMessage id="Date_of_birth" />:{" "}
                    <span className="font-light">
                      {FormatDate(data?.Date_of_birth)}
                    </span>
                  </CardTitle>{" "}
                </CardContent>
              </div>
            )}
            <TabsList className="flex-wrap flex lg:justify-start">
              <TabsTrigger value="task">
                <FormattedMessage id="Task" />
              </TabsTrigger>
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
            </TabsList>
            <TabsContent value="task" className="p-0 border-0">
              <AufgabeRelatedToPatient
                data={tasks}
                columns={columnsRelatedToPatient}
                pagination
                patientData={data}
              />
            </TabsContent>
            <TabsContent className="p-0 border-0" value="medical_service">
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
            <TabsContent className="p-0 border-0" value="medication">
              {medication.data ? (
                <MedicationTable
                  data={medication.data}
                  columns={MedicationColumns()}
                  pagination
                />
              ) : (
                <div className="w-full flex justify-center items-center">
                  <Loader2 className="h-16 w-16 m-5 animate-spin" />
                </div>
              )}
            </TabsContent>
            <TabsContent className="p-0 border-0" value="work_inability">
              {workInability.data ? (
                workInability.data.length > 0 ? (
                  <WorkInabilityTable
                    data={workInability.data} // Pass the current item to the table
                    columns={WorkInabilityColumns()}
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
              className="p-0 border-0"
              value="therapeutic_and_aid_supplies"
            >
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
            <TabsContent className="p-0 border-0 " value="hospital">
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

            <TabsContent className="p-0 border-0" value="rehab">
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
          </Tabs>
        </section>{" "}
      </main>{" "}
    </>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <Loader2 className="h-24 w-24 animate-spin" />
    </div>
  );
}
