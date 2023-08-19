import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/Navbar";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    const queryClient = new QueryClient();

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <Navbar />
                <div className="hidden md:flex mt-12 w-24 flex-col fixed inset-y-0">
                    <Sidebar />
                </div>

                <Component {...pageProps} />
            </QueryClientProvider>
        </SessionProvider>
    );
}
