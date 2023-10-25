import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { signIn } from "next-auth/react";
import { Loader2, CheckCircle } from "lucide-react";
import { useMutation } from "react-query";
import { signup } from "@/api";
import { useIntl, FormattedMessage } from "react-intl";

export default function RegisterForm() {
    const { formatMessage } = useIntl();

    const formSchema = z
        .object({
            email: z
                .string()
                .min(1, {
                    message: formatMessage({
                        id: "username_required",
                    }),
                })
                .email({
                    message: formatMessage({
                        id: "email_control",
                    }),
                }),
            password: z
                .string()
                .min(1, {
                    message: formatMessage({
                        id: "password_required",
                    }),
                })
                .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, {
                    message: formatMessage({
                        id: "password_control",
                    }),
                }),

            password2: z.string().min(1, {
                message: formatMessage({
                    id: "password_required",
                }),
            }),
            first_name: z.string().min(1, {
                message: formatMessage({
                    id: "first_name_required",
                }),
            }),
            last_name: z.string().min(1, {
                message: formatMessage({
                    id: "last_name_required",
                }),
            }),
        })
        .refine((schema) => schema.password === schema.password2, {
            message: formatMessage({
                id: "passwords_mismatch",
            }),
            path: ["password2"],
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            password2: "",
            first_name: "",
            last_name: "",
        },
        mode: "onTouched",
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
        <Card className="w-80 shadow-md">
            <CardHeader>
                <CardTitle>
                    <FormattedMessage
                        id={mutation.isSuccess ? "success" : "register"}
                    />{" "}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {mutation.isSuccess ? (
                    <>
                        <div className="flex justify-between items-center mt-2">
                            <p className="font-medium text-lg">
                                <FormattedMessage id={"user_created"} />{" "}
                            </p>
                            <CheckCircle className="ml-2 text-green-500" />
                        </div>
                        <Button onClick={() => signIn()} className="mt-5">
                            <FormattedMessage id={"signin"} />{" "}
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
                                            <FormattedMessage id={"password"} />{" "}
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
                                            <FormattedMessage
                                                id={"confirm_password"}
                                            />
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
                                            <FormattedMessage
                                                id={"first_name"}
                                            />
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
                                            <FormattedMessage
                                                id={"Last_name"}
                                            />
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
                                    <FormattedMessage id={"send"} />
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
