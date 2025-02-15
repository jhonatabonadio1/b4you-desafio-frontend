import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts";
import { queryClient } from "@/services/queryClient";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";

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
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
