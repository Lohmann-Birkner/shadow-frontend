import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";
import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";
import cx from "classnames";
import Link from "next/link";
import { cn } from "@/lib/utils";


function Navbar() {
  const { data: session } = useSession();
  const { pathname, asPath } = useRouter();
  const { locale } = useIntl();

  return (
    <header className="fixed top-0 w-full flex items-center justify-between pl-3 pr-6 py-2 2xl:px-16 shadow-sm mx-0 border-b bg-white h-12">
      <MobileSidebar />
      <h1 className="hidden md:block text-xl font-bold">SHADOW</h1>
      <ul className="list-style-none ml-auto flex flex-col pl-0 lg:mt-1 sm:flex-row sm:mt-2">
        <li className="mb-4 pl-2 lg:mb-0 lg:pl-0 lg:pr-1 mr-5 mt-1" >
          
          <Link
            href={asPath}
            locale="de"
            className="lg:px-2 hover:font-semibold"
          >
            DE
          </Link>
          /
          <Link href={asPath} locale="en"
            className="lg:px-2 hover:font-semibold"
          
          >
            EN
          </Link>
        </li>
        <li className="mb-4 pl-2 lg:mb-0 lg:pl-0 lg:pr-1">
          {session?.user ? (
            <Button
              variant={"outline"}
              onClick={() => signOut()}
              className="p-0 text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            >
              <FormattedMessage id="signout" />
            </Button>
          ) : (
            <Button
              variant={"outline"}
              onClick={() => signIn()}
              className="p-0 text-neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            >
              <FormattedMessage id="signout" />
            </Button>
          )}
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
