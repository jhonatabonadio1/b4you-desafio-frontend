import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts";
import { queryClient } from "@/services/queryClient";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClientProvider } from "react-query";
import CookieConsent from "react-cookie-consent";
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
          <CookieConsent cookieName="incorporae" expires={150} location="bottom" buttonText="Eu entendo"  
  >Este site usa cookies para melhorar a experiência do usuário.</CookieConsent>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
