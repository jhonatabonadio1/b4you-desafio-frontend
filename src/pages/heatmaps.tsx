/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppSidebar } from "@/components/app-sidebar";
import { DocumentHeatmapView } from "@/components/document/document-heatmap-view";
import { DocumentsCombobox } from "@/components/documents-combobox";
import { ModeSwitcher } from "@/components/mode-switcher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/services/apiClient";
import { useFiles } from "@/services/hooks/files";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Head from "next/head";

import { useEffect, useState } from "react";

export default function Heatmaps() {


  const [pdfUrl, setPdfUrl] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const { data, isLoading } = useFiles();

  const [docId, setDocId] = useState("")

  const [documentsPickerData, setDocumentsPickerData] = useState<
  { label: string; value: string }[]
>([] as { label: string; value: string }[]);

  useEffect(() => {
    if (data && data.length > 0) {
      for (const file of data) {
        const pickerData = {
          label: file.title,
          value: file.id,
        };
        setDocumentsPickerData((prev) => [...prev, pickerData]);
      }
    }
  }, [data]);

  async function onSubmit() {
    try {
      const { data } = await api.get(`/file/${docId}`);
      setPdfUrl(data.url);
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    }
  }

  function onLoadDocument(pdf: any) {
    console.log(pdf);
    setNumPages(pdf.numPages);
  }

  function prevPage() {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  }

  function nextPage() {
    if (numPages && pageNumber < numPages) setPageNumber((prev) => prev + 1);
  }

  return (
    <>
      <Head>
        <title>Mapas de calor - Incorporae!</title>
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
                        <BreadcrumbLink href="#">Mapas de calor</BreadcrumbLink>
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
          <div className="relative flex flex-1 flex-col gap-4 p-4">
            <header className="flex flex-col lg:flex-row lg:items-center gap-4 w-full justify-between border-b py-4">
              <div>
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Mapas de calor
                </h2>
                <p className="text-muted-foreground">
                  Confira o mapa de calor de seus documentos.
                </p>
              </div>
            </header>

            <div className="relative flex flex-col h-full w-full gap-4">
              <div className="flex flex-col gap-4 lg:flex-row items-center">
                <div className="flex w-full flex-row gap-4">
                  <div className="flex flex-row gap-2 self-start">
                    {!isLoading && (
                      <DocumentsCombobox
                        data={documentsPickerData}
                        value={docId}
                        onChange={(docId) => setDocId(docId)}
                      />
                    )}

            
                  </div>
                  <Button onClick={onSubmit} className="lg:w-auto w-full">Ver mapa</Button>
                </div>
                {numPages && numPages > 1 && (
                  <div className="flex flex-row gap-2 items-center w-full justify-end">
                    <div>
                      Página {pageNumber} de {numPages}
                    </div>
                    <Button
                      onClick={prevPage}
                      variant="outline"
                      className="px-3"
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      onClick={nextPage}
                      variant="outline"
                      className="px-3"
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                )}
              </div>
              {pdfUrl && (
              <Card className="flex-1 items-center justify-center overflow-auto">
                <CardHeader className="relative flex flex-row h-full items-center p-0 justify-center">
                  <div className="relative rounded-lg  flex-1">
                    
                      <DocumentHeatmapView
                        pdfUrl={pdfUrl}
                        docId={docId as string}
                        page={pageNumber}
                        onLoad={(doc) => onLoadDocument(doc)}
                      />
        
                  </div>
                </CardHeader>
              </Card>
                          )}
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
