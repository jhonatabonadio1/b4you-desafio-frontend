 
 
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { MoonLoader } from "react-spinners";
import { api } from "@/services/apiClient";
import Head from "next/head";
import { DocumentHeatmapCapture } from "@/components/document/document-heatmap-capture";


export default function View() {
  const router = useRouter();


  const { docId } = router.query;



  const [pdfUrl, setPdfUrl] = useState("false")
  const [isLoading, setIsLoading] = useState(true);
  
  const modalRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    async function fetchPdf() {
      if (!docId) return;
      try {
        const { data } = await api.get(`/file/${docId}`);
        setPdfUrl(data.url);
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPdf();
  }, [docId]);


  return (
    <>
      <Head>
        <title>Documento - Incorporae!</title>
      </Head>

      <div
        ref={modalRef}
        className="rounded shadow-lg max-h-screen w-full flex flex-col items-center overflow-y-auto"
      >
        <div className="w-screen h-screen flex items-center justify-center">
          {isLoading || !pdfUrl ? (
            <div className="absolute inset-0 flex items-center justify-center z-60">
              <MoonLoader color="#FFF" size={34} />
            </div>
          ) : (
            <>
       

              <div ref={pdfWrapperRef} className="relative items-center w-full">

                <DocumentHeatmapCapture pdfUrl={pdfUrl} docId={docId as string}  />
              
              </div>
            </>
          )}
        </div>

        {/* Marca d'água */}
        <div className="fixed top-4 right-4 text-white bg-black/60 px-4 py-2 rounded-md z-50">
          <Link href="/" target="_blank" className="font-base text-sm">
            By: <b>Incorporae!</b>
          </Link>
        </div>

    
      </div>
    </>
  );
}