import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
    </div>
    </>
  );
}
