import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { api } from "@/services/apiClient";
import Head from "next/head";
import { DocumentHeatmapCapture } from "@/components/document/document-heatmap-capture";
import { Icons } from "@/components/icons";

export default function View() {
  const router = useRouter();

  const { docId } = router.query;

  const [pdfUrl, setPdfUrl] = useState("false");
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);

  const [docTitle, setDocTitle] = useState("");

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
        className="rounded shadow-lg max-h-screen w-full flex flex-col items-center overflow-y-auto"
      >
        <div className="fixed top-4 right-4 text-primary-foreground bg-primary h-10 w-10 flex items-center justify-center rounded-full z-50">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="w-7 h-7 text-primary-foreground" />
          </Link>
        </div>
        <div className="w-screen h-screen flex items-center justify-center">
          {isLoading || !pdfUrl ? (
            <div className="absolute inset-0 flex items-center justify-center z-60">
              <Icons.spinner className="text-primary animate-spin" />
            </div>
          ) : (
            <>
              <div ref={pdfWrapperRef} className="relative items-center w-full">
                <DocumentHeatmapCapture
                  pdfUrl={pdfUrl}
                  docId={docId as string}
                  fullscreenRef={pdfWrapperRef}
                />
              </div>
            </>
          )}
        </div>

        {/* Marca d'água */}
      </div>
    </>
  );
}
