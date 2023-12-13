import { SessionProvider, useSession } from "next-auth/react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { IntlProvider } from "react-intl";
import English from "../locales/en.json";
import German from "../locales/de.json";
import { useRouter } from "next/router";
import React from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient();
  const { locale, defaultLocale } = useRouter();

  const messages = React.useMemo(() => {
    switch (locale) {
      case "en":
        return English;
        break;
      case "de":
        return German;
        break;
      default:
        return German;
        break;
    }
  }, [locale]);


  return (
    <IntlProvider
      messages={messages}
      locale={locale || defaultLocale || ""}
      defaultLocale={defaultLocale}
    >
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <div className="hidden lg:flex mt-12 w-24 flex-col fixed inset-y-0">
            <Sidebar />
          </div>

          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </IntlProvider>
  );
}
