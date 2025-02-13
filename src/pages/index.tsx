import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import { PricingSectionCards } from "@/components/pricing-section-cards";
import { Hero } from "@/components/hero";
import {IconSectionStackedCards} from "@/components/icon-section-stacked";
import {Faq} from "@/components/faq";

export default function Home() {
  return (
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
  );
}
