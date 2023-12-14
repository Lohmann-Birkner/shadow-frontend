import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    authorizationToken?: string;
    user: {
      user_id?: string;
      email: string;
      image?: string;
      first_name?: string;
      last_name?: string;
    };
  }
}
