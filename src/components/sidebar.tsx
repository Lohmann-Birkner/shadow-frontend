import React from "react";
import { Users2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { useSession } from "next-auth/react";
import { Database } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  setOpen?: (open: boolean) => void;
}

function Sidebar({ setOpen }: Props) {
  const { formatMessage } = useIntl();
  const { data, update } = useSession();

  const routes = [
    {
      icon: Users2,
      href: "/versicherten",
      label: formatMessage({ id: "Insured_person" }),
    },
    {
      icon: ClipboardList,
      href: "/aufgaben",
      label: formatMessage({ id: "Tasks" }),
    },
  ];
  console.log(data?.user);
  const router = useRouter();

  const onClick = (href: string) => {
    router.push(href);
    setOpen && setOpen(false);
  };
  return (
    data?.user && (
      <aside className="space-y-4 flex flex-col md:border-r bg-white h-full">
        <div className="flex p-3 flex-1 justify-center">
          <div className="space-y-2">
            {routes.map((route) => (
              <div
                onClick={() => onClick(route.href)}
                className={cn(
                  "group flex w-full p-2 justify-start cursor-pointer hover:bg-slate-100 rounded-lg transition text-xs",
                  router.pathname === route.href && "bg-slate-100"
                )}
                key={route.href}
              >
                <div className="flex flex-col gap-y-1 items-center flex-1 ">
                  <route.icon className="h-5 w-5 " />
                  {route.label}
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <div
                className={cn(
                  "p-2  cursor-pointer hover:bg-slate-100 rounded-lg transition content-center items-center flex flex-col ",
                  localStorage.getItem("selected_database") ===
                    "shadow_large" && "bg-slate-100"
                )}
              >
                <Database
                  onClick={() => {
                    localStorage.setItem("selected_database", "shadow_large");
                    location.reload();
                  }}
                  size={24}
                />
                <p>1.000.000</p>
              </div>
              <div
                className={cn(
                  "p-2  cursor-pointer hover:bg-slate-100 rounded-lg transition content-center items-center flex flex-col ",
                  localStorage.getItem("selected_database") ===
                    "shadow_extreme_large" && "bg-slate-100"
                )}
              >
                <Database
                  onClick={() => {
                    localStorage.setItem(
                      "selected_database",
                      "shadow_extreme_large"
                    );
                    location.reload();
                  }}
                  size={36}
                />
                <p>10.000.000</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    )
  );
}

export default Sidebar;
