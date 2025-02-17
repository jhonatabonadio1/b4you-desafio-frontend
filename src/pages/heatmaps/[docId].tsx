import { AppSidebar } from "@/components/app-sidebar";
import { DocumentHeatmapView } from "@/components/document/document-heatmap-view";
import { ModeSwitcher } from "@/components/mode-switcher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { withSSRAuth } from "@/utils/withSSRAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Heatmaps() {
  const route = useRouter();

  const { docId } = route.query;

  const [numPages, setNumPages] = useState(0);

  console.log("Páginas:", numPages)

  return (
    <>
      <Head>
        <title>Heatmaps - Incorporae!</title>
      </Head>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-gradient-to-tr from-primary-foreground via-background to-background">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-row items-center w-full justify-between px-4 gap-4">
              <div className="flex items-center gap-2 ">
                <SidebarTrigger className="-mx-1" />
                <div className="hidden self-center items-center gap-1 md:flex">
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className=" md:block">
                        <BreadcrumbLink href="#">Heatmpas</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 ">
                <div className="w-auto">
                  <ModeSwitcher />
                </div>
              </div>
            </div>
          </header>
          <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
            <header className="flex flex-col lg:flex-row lg:items-center gap-4 w-full justify-between border-b py-4">
              <div>
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                  Heatmpas
                </h2>
                <p className="text-muted-foreground">
                  Confira o mapa de calor de seus documentos.
                </p>
              </div>
            </header>

            <div className="relative flex flex-col h-full w-full">
              <Card className="flex-1 items-center justify-center overflow-auto">
                <CardHeader className="relative flex flex-row h-full items-center p-0 justify-center">
                
                  <div className="relative rounded-lg  flex-1">
                
                    <DocumentHeatmapView
                      docId={docId as string}
                      onLoad={(doc) => setNumPages(doc.numPages)}
                    />


                   
                  </div>
               
                </CardHeader>
           
              </Card>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
