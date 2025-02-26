import { PlanSelect } from "@/components/plan-select";
import { SiteHeader } from "@/components/site-header";

import { withSSRAuth } from "@/utils/withSSRAuth";

import Head from "next/head";
export default function Success() {
  return (
    <>
      <Head>
        <title>Upgrade - Incorporae!</title>
      </Head>
      <div data-wrapper="" className="border-grid flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">
        <PlanSelect />
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => ({ props: {} }));
