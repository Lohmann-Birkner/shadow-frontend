import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

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
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                // perform you login logic
                // find out user from db
                if (email !== "user@mail.com" || password !== "1234") {
                    throw new Error("invalid credentials");
                }

                // if everything is fine
                return {
                    id: "1234",
                    name: "John Doe",
                    email: "user@mail.com",
                    role: "admin",
                };
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
};
export default NextAuth(authOptions);
