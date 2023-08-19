import React from "react";
import { Users2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

function Sidebar() {
    const routes = [
        {
            icon: Users2,
            href: "/versicherten",
            label: "Versicherten",
        },
        {
            icon: ClipboardList,
            href: "/aufgaben",
            label: "Aufgaben",
        },
    ];

    const router = useRouter();
    return (
        <aside className="space-y-4 flex flex-col md:border-r bg-white h-full">
            <div className="flex p-3 flex-1 justify-center">
                <div className="space-y-2">
                    {routes.map((route) => (
                        <div
                            onClick={() => router.push(route.href)}
                            className={cn(
                                "group flex w-full p-2 justify-start cursor-pointer hover:bg-slate-100 rounded-lg transition text-xs",
                                router.pathname === route.href && "bg-slate-100"
                            )}
                            key={route.href}>
                            <div className="flex flex-col gap-y-1 items-center flex-1">
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
