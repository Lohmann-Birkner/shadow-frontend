import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email({ message: "Ungültige Email" }),
    password: z.string().min(1, { message: "Passwort ist erforderlich" }),
});

const SignIn: NextPage = () => {
    const [loginError, setLoginError] = useState("");
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        if (res?.status === 401) {
            setLoginError("Email oder Passwort sind falsch");
        }
        if (res?.ok) {
            router.push("/");
        }
    }

    return (
        <main className="flex h-screen justify-center items-center">
            <Card className="w-80">
                <CardHeader>
                    <CardTitle>Anmelden</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="mt-4"
                            onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mt-3">
                                        <FormLabel>Passwort</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="mt-8" type="submit">
                                Senden
                            </Button>
                            {loginError && (
                                <p className="text-red-500 mt-3">
                                    {loginError}
                                </p>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
};

export default SignIn;
