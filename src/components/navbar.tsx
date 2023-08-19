import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";

function Navbar() {
    const { data: session } = useSession();

    return (
        <header className="fixed top-0 w-full flex items-center justify-between pl-3 pr-6 py-2 2xl:px-16 shadow-sm mx-0 border-b bg-white h-12">
            <MobileSidebar />
            <h1 className="hidden md:block text-xl font-bold">SHADOW</h1>
            {session?.user ? (
                <Button variant={"outline"} onClick={() => signOut()}>
                    Abmelden
                </Button>
            ) : (
                <Button
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => signIn()}>
                    Anmelden
                </Button>
            )}
        </header>
    );
}

export default Navbar;
