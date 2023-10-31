// import { withAuth } from "next-auth/middleware";

export async function middleware() {
    const response = await fetch("https://secret-2wilmfr6eq-uc.a.run.app");
    const envVariables = await response.json();
    process.env.NEXTAUTH_SECRET = envVariables?.NEXTAUTH_SECRET;
}

// const middlewares = [
//     middleware,
//     withAuth({
//         // Matches the pages config in `[...nextauth]`
//         pages: {
//             signIn: "/auth/signin",
//         },
//     }),
// ];

// export default middlewares;
