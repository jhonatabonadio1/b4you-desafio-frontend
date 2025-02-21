import { META_THEME_COLORS } from "@/config/site";
import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />

        {/* Fallback para navegadores sem suporte ao prefers-color-scheme */}
        <link rel="favicon" href="/favicon.ico" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Meta de compatibilidade */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={cn("min-h-svh bg-background font-sans antialiased")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
