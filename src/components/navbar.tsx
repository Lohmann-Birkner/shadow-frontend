import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import MobileSidebar from "./mobile-sidebar";
import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";
import cx from "classnames";
import Link from "next/link";
import { cn } from "@/lib/utils";
import styles from "./navbar.module.scss";
import { Separator } from "@/components/ui/separator";

function Navbar() {
  const { data } = useSession();
  const { asPath } = useRouter();
  const { locale } = useIntl();

  return (
    <header className="fixed top-0 w-full z-20 flex items-center justify-between pl-3 pr-6 py-2 2xl:px-16 shadow-sm mx-0 border-b bg-white h-12">
      {data?.user && <MobileSidebar />}
      <h1 className="hidden lg:block text-xl font-bold">SHADOW</h1>
      <ul className="list-style-none ml-auto flex  pl-0 lg:mt-1 sm:flex-row sm:mt-2 h-10">
        {data?.user && (
          <>
            <div className="flex h-5 items-center space-x-4 text-md mb-4 pl-2 lg:mb-0 lg:pl-0 lg:pr-1 mr-5 mt-1">
              <div>Email:{data.user.email}</div>
              <Separator orientation="vertical" />
              <div>User ID:{data.user.user_id}</div>
              <Separator orientation="vertical" />
              <div><FormattedMessage id="Last_name" />:{data.user.last_name}</div>
              <Separator orientation="vertical" />
              <div><FormattedMessage id="first_name" />:{data.user.first_name}</div>
              <Separator orientation="vertical" />


            </div>
     
          </>
        )}

        <li className="flex h-5 items-center space-x-4 text-sm mb-4 pl-2 lg:mb-0 lg:pl-0 lg:pr-1 mr-5 mt-1">
          <Link
            href={asPath}
            locale="de"
            className={cx({
              [styles.underline]: locale === "de",
            })}
          >
            DE
          </Link>
          /
          <Link
            href={asPath}
            locale="en"
            className={cx({
              [styles.underline]: locale === "en",
            })}
          >
            EN
          </Link>
        </li>
        <li className="flex h-5 items-center space-x-4 text-sm mb-4 pl-2 lg:mb-0 lg:pl-0 lg:pr-1 mr-5 mt-1">
          {data?.user ? (
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
              <FormattedMessage id="signin" />
            </Button>
          )}
        </li>
      </ul>
    </header>
  );
}

export default Navbar;
