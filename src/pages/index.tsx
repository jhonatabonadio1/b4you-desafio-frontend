import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import CookieConsent from "react-cookie-consent";

import { PricingSectionCards } from "@/components/pricing-section-cards";
import { Hero } from "@/components/hero";
import {IconSectionStackedCards} from "@/components/icon-section-stacked";
import {Faq} from "@/components/faq";
import Head from "next/head";

export default function Home() {
  return (
    <>
    <Head><title>Faça upload de seus PDFs e incorpore em seu site - Incorporae!</title></Head>
    <div data-wrapper="" className="border-grid flex flex-1 flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Hero />

        <IconSectionStackedCards />
        <PricingSectionCards />

        <Faq />
      </main>

      {/* Footer */}
      <SiteFooter />
      <CookieConsent cookieName="incorporae-cookies" expires={150} location="bottom" buttonText="Eu entendo" containerClasses="!bg-foreground !text-background"  buttonClasses="!bg-background !text-foreground !rounded-lg !inline-flex !items-center !justify-center !gap-2 !whitespace-nowrap !rounded-md !text-sm !font-medium !transition-colors !focus-visible:outline-none !focus-visible:ring-1 !focus-visible:ring-ring !disabled:pointer-events-none !disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" 
  >Este site usa cookies para melhorar a experiência do usuário.</CookieConsent>
    </div>
    </>
  );
}
