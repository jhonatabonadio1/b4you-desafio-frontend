import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts";
import { queryClient } from "@/services/queryClient";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";

import { GoogleTagManager } from '@next/third-parties/google'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          <Component {...pageProps} />

          <Toaster />


          <GoogleTagManager gtmId="GTM-59Z4JF2K" />
        
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
