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
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    username: z.string({ required_error: "Username ist erforderlich" }),
    password: z.string({ required_error: "Passwort ist erforderlich" }),
});

const SignIn: NextPage = () => {
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const res = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
        });
        if (res?.status !== 200) {
            setLoginError("Username oder Passwort sind falsch");
            setIsLoading(false);
        }
        if (res?.ok) {
            router.push("/");
        }
    }

    const labelStyle = "after:content-['*'] after:text-red-500 after:ml-0.5";

    return (
        <main className="flex h-screen justify-center items-center">
            <Card className="w-80 shadow-md">
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
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={labelStyle}>
                                            Username
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
                                    <FormItem className="mt-3">
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

                            <Button
                                disabled={isLoading}
                                className="mt-8"
                                type="submit">
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
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
};

export default SignIn;
