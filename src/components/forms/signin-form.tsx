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
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";

interface Props {
  setIsSignin: (isSignin: boolean) => void;
}

export default function SigninForm({ setIsSignin }: Props) {
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { formatMessage } = useIntl();

  const formSchema = z.object({
    username: z.string().min(1, {
      message: formatMessage({
        id: "username_required",
      }),
    }),
    password: z.string().min(1, {
      message: formatMessage({
        id: "password_required",
      }),
    }),
  });

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

    console.log("res", res);

    if (!res?.ok) {
      setLoginError("Username oder Passwort sind falsch");
      setIsLoading(false);
    } else {
      router.push("/versicherten");
      localStorage.setItem("database", "shadow_large");
    }
  }

  const labelStyle = "after:content-['*'] after:text-red-500 after:ml-0.5";

  return (
    <>
      <Card className="w-80 shadow-md">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="signin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="mt-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyle}>
                      <FormattedMessage id="username" />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
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
                      <FormattedMessage id="password" />
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} className="mt-8" type="submit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <FormattedMessage id="send" />
              </Button>
              {loginError && <p className="text-red-500 mt-3">{loginError}</p>}
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="mt-3">
        <FormattedMessage id="not_registered" />
        <Button
          variant={"ghost"}
          className="font-semibold p-1"
          onClick={() => setIsSignin(false)}
        >
          <FormattedMessage id="register" />
        </Button>
      </p>
    </>
  );
}
