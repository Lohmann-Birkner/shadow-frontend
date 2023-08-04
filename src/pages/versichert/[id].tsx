import React, { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { getInsured } from "@/api";
import { Edit } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mockDocumentation = [
    "reprehenderit deserunt animi. Voluptatem, eligendi necessitatibus assumenda itaque non iure eveniet minus fugit error deserunt, et praesentium, ducimus dolorum minima! Harum, esse quos",
];

export default function Page() {
    const { query } = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [documentation, setDocumentation] = useState(mockDocumentation);

    const { data } = useQuery("insured", () => getInsured(query.id as string));

    const addDocumentation = () => {
        if (textareaRef.current) {
            const textareaValue = textareaRef.current.value;

            if (!textareaValue) {
                return;
            }

            setDocumentation((prevArray) => [...prevArray, textareaValue]);
            textareaRef.current.value = ""; // Clear the textarea
        }
    };

    return (
        <main className="grid  px-5 2xl:px-16 2xl:gap-8 h-screen rounded-md grid-cols-3">
            <section className="col-span-1 flex flex-col  pb-5">
                <Card className="mt-5">
                    <CardContent className="px-4 py-5">
                        <CardTitle className="mb-1 text-lg">
                            Versicherungsnummer:{" "}
                            <span className="font-light">
                                {data?.insuranceNumber}
                            </span>
                        </CardTitle>
                        <CardTitle className="mb-1 text-lg">
                            Name:{" "}
                            <span className="font-light">
                                {`${data?.lastName} ${data?.firstName}`}
                            </span>
                        </CardTitle>
                        <CardTitle className="mb-1 text-lg">
                            Geburtsdatum:{" "}
                            <span className="font-light">
                                {data?.dateOfBirth}
                            </span>
                        </CardTitle>
                        <CardTitle className="mb-1 text-lg">
                            Geschlecht:{" "}
                            <span className="font-light">{data?.sex}</span>
                        </CardTitle>
                        <CardTitle className="text-lg">
                            Postleitzahl:{" "}
                            <span className="font-light">{data?.zipcode}</span>
                        </CardTitle>
                    </CardContent>
                </Card>
                <Card className="mt-5 flex-1 flex flex-col">
                    <CardHeader className="pt-6">
                        <CardTitle className="flex items-center text-lg mb-1">
                            <Edit className="h-4 w-4  mr-2" /> Dokumentation
                            hinzufügen
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <Textarea
                            placeholder="Hier Documentation eingeben..."
                            className="h-full"
                            ref={textareaRef}
                        />
                        <div className="flex w-full">
                            <Button
                                className="mt-5 ml-auto hover:bg-slate-200"
                                variant={"secondary"}
                                onClick={addDocumentation}>
                                Speichern
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <section className="col-span-2 ml-4 grid grid-rows-2  pb-5">
                <Tabs
                    defaultValue={"doctor_information"}
                    className="py-5 flex flex-col">
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="doctor_information">
                            Arztdaten
                        </TabsTrigger>
                        <TabsTrigger value="medication">
                            Arzneimittel
                        </TabsTrigger>
                        <TabsTrigger value="medical_certificates">
                            AU
                        </TabsTrigger>
                        <TabsTrigger value="therapeutic_and_aid_supplies">
                            Heil- und Hilfsmittel
                        </TabsTrigger>
                        <TabsTrigger value="hospital">Krankenhaus</TabsTrigger>
                        <TabsTrigger value="medicines">Medikamente</TabsTrigger>
                        <TabsTrigger value="rehabilitation">Reha</TabsTrigger>
                    </TabsList>

                    <TabsContent
                        className="pt-2 overflow-y-scroll flex-1"
                        value="doctor_information">
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
                    <TabsContent className="flex-1" value="medication">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent
                        className="flex-1"
                        value="medical_certificates">
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
                    <TabsContent
                        className="flex-1"
                        value="therapeutic_and_aid_supplies">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent className="flex-1" value="hospital">
                        culpa necessitatibus facere quas quibusdam alias animi
                        obcaecati dolor laudantium blanditiis sunt ipsam autem
                        distinctio omnis fuga, harum nulla mollitia voluptate
                        nostrum esse totam odio. Consectetur distinctio velit,
                        voluptatum provident facilis explicabo quam ut enim
                        architecto quae modi laudantium, inventore vero aperiam
                    </TabsContent>
                    <TabsContent className="flex-1" value="medicines">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Adipisci dolores corporis aliquam mollitia ad accusamus
                        rerum rem perferendis alias animi!
                    </TabsContent>
                    <TabsContent className="flex-1" value="rehabilitation">
                        reprehenderit deserunt animi. Voluptatem, eligendi
                        necessitatibus assumenda itaque non iure eveniet minus
                        fugit error deserunt, et praesentium, ducimus dolorum
                        minima! Harum, esse quos.
                    </TabsContent>
                </Tabs>
                <Card className="flex-1 overflow-y-scroll">
                    <CardHeader className="pb-1">
                        <CardTitle className="text-xl">Documentation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc px-5 leading-5">
                            {documentation.map((item, index) => (
                                <li className="mt-3" key={index}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
