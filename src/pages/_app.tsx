/* eslint-disable react/no-string-refs */
import { type Session, createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import { type AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";
import { api } from "~/utils/api";

function Twotter({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
      <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
        <ThemeProvider defaultTheme="cupcake">
          <Head>
            <title>Twotter</title>
            <meta name="description" content="an anonymised twitter" />
            <link rel="icon" ref="/favicon.ico" />
          </Head>
          <Toaster position="top-center" />
          <Analytics />
          <main className="flex min-h-screen flex-row place-content-center text-base-content">
            <Component {...pageProps} />
          </main>
        </ThemeProvider>
      </SessionContextProvider>
  );
}

export default api.withTRPC(Twotter);
