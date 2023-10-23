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
import { Loader2, CheckCircle } from "lucide-react";
import { useMutation } from "react-query";
import { signup } from "@/api";

const formSchema = z
    .object({
        email: z.string({ required_error: "Username ist erforderlich" }).email({
            message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
        }),
        password: z
            .string({ required_error: "Passwort ist erforderlich" })
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
                message:
                    "Muss mindestens eine Zahl und einen Groß- und Kleinbuchstaben enthalten und ein Kleinbuchstabe, und mindestens 8 Zeichen",
            }),

        password2: z.string({ required_error: "Passwort ist erforderlich" }),
        first_name: z.string({ required_error: "Vorname ist erforderlich" }),
        last_name: z.string({ required_error: "Nachname ist erforderlich" }),
    })
    .refine((schema) => schema.password === schema.password2, {
        message: "Die Passwörter stimmen nicht überein",
        path: ["password2"],
    });

const SignIn: NextPage = () => {
    const [loginError, setLoginError] = useState("");

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            password2: "",
            first_name: "",
            last_name: "",
        },
        mode: "onChange",
    });

    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => signup(values),
        onError: (error) => console.log(error),
    });

    const isLoading = mutation.isLoading;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    const labelStyle = "after:content-['*'] after:text-red-500 after:ml-0.5";

    return (
        <main className="flex h-screen justify-center items-center">
            <Card className="w-80 shadow-md">
                <CardHeader>
                    <CardTitle>
                        {mutation.isSuccess ? "Success!" : "Signin"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {mutation.isSuccess ? (
                        <>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-medium text-lg">
                                    New user was created
                                </p>
                                <CheckCircle className="ml-2 text-green-500" />
                            </div>
                            <Button onClick={() => signIn()} className="mt-5">
                                Signin
                            </Button>
                        </>
                    ) : (
                        <Form {...form}>
                            <form
                                className="mt-4 flex flex-col space-y-4"
                                onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Passwort
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Passwort bestätigen
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    type="password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Vorname
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelStyle}>
                                                Nachname
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="pt-4">
                                    <Button disabled={isLoading} type="submit">
                                        {isLoading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Senden
                                    </Button>
                                    {loginError && (
                                        <p className="text-red-500 mt-3">
                                            {loginError}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </main>
    );
};

export default SignIn;
