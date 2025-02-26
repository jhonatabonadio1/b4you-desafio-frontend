import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { api } from "@/services/apiClient";
import Head from "next/head";
import { DocumentHeatmapCapture } from "@/components/document/document-heatmap-capture";
import { Icons } from "@/components/icons";

export default function Doc() {
  const router = useRouter();

  const { docId } = router.query;

  const [pdfUrl, setPdfUrl] = useState("false");
  const [isLoading, setIsLoading] = useState(true);
  const [docTitle, setDocTitle] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPdf() {
      if (!docId) return;
      try {
        const { data } = await api.get(`/file/${docId}`);
        setPdfUrl(data.url);
        setDocTitle(data.title);
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPdf();
  }, [docId]);

  /** POSSO DEFINIR UM USERAGENT LOCAL (SALVAR NO LOCALSTORAGE O ID DO NAVEGADOR, SE NÃO EXISTIR, CADASTRA UM.) */

  return (
    <>
      <Head>
        <title>{docTitle} - Incorporaê</title>
      </Head>

      <div
        ref={modalRef}
        className="rounded overflow-x-hidden shadow-lg max-h-screen w-full flex flex-col items-center overflow-y-auto"
      >
        <div className="w-screen h-screen flex items-center justify-center">
          {isLoading || !pdfUrl ? (
            <div className="absolute inset-0 flex items-center justify-center z-60">
               <Icons.spinner className="text-primary animate-spin"/>
            </div>
          ) : (
            <>
              <div
                ref={pdfWrapperRef}
                className="border border-b-0 border-top-0 border-grid relative flex flex-col justify-center  items-center w-full max-w-3xl bg-primary-foreground max-h-full overflow-y-auto h-full"
              >
                <div className="fixed top-4 right-4 text-primary-foreground bg-primary px-3 py-2 rounded-full z-50">
                  <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="h-6 w-6" />
                    <span className="hidden font-bold lg:inline-block text-md">
                      Incorporaê!
                    </span>
                  </Link>
                </div>
                <DocumentHeatmapCapture
                  pdfUrl={pdfUrl}
                  docId={docId as string}
                  fullscreenRef={pdfWrapperRef}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
