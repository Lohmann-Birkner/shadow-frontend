import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { getUser } from "@/api";

let authorizationToken = "";

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
                    authorizationToken = response.data.Authorization;
                } catch (error) {
                    console.log("error", error);
                }

                if (response?.status !== 200) {
                    throw new Error("Error in Login");
                }

                // if everything is fine
                return {
                    id: "test id",
                    name: "test name",
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async session({ session }: any) {
            // Send properties to the client, like an access_token from a provider.
            session.authorizationToken = authorizationToken;

            return session;
        },
    },
};
export default NextAuth(authOptions);
