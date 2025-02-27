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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Meta de compatibilidade */}
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="keywords"
          content="incorporae, incorporar PDFs, embed PDF, iframe PDF, rastreamento de PDFs, PDF insights, visualizar PDF online, segurança de PDFs, quem leu meu pdf"
        />
        <meta
          name="description"
          content="O Incorporaê permite incorporar PDFs em sites com segurança, criptografia ponta a ponta e rastreamento avançado de interações. Experimente agora!"
        />

        <meta
          property="og:title"
          content="Incorporaê - Incorpore PDFs em seu Site com Segurança e Insights"
        />
        <meta
          property="og:description"
          content="Incorpore PDFs no seu site com facilidade, criptografia avançada e rastreamento detalhado. Descubra o poder do Incorporaê!"
        />
        <meta
          property="og:image"
          content="https://www.incorporae.com.br/og-image.jpg"
        />
        <meta property="og:url" content="https://www.incorporae.com.br" />
        <meta property="og:type" content="website" />

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
