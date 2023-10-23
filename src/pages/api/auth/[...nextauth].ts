import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { getUser } from "@/api";
import { setCookie, getCookie } from "cookies-next";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.

            credentials: {},
            async authorize(credentials) {
                const { username, password } = credentials as {
                    username: string;
                    password: string;
                };

                let response;
                try {
                    response = await getUser({ username, password });
                } catch (error) {
                    console.log("error", error);
                }

                // perform you login logic
                // find out user from db
                if (response?.status !== 200) {
                    throw new Error("Error in Login");
                }

                // if everything is fine
                return {
                    id: response.data.Authorization,
                    name: response.data.Authorization,
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
};
export default NextAuth(authOptions);
