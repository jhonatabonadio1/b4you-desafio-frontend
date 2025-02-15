/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MoonLoader } from "react-spinners";
import { api } from "@/services/apiClient";
import Head from "next/head";
import h337 from "heatmap.js";
import { throttle } from "lodash";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface HeatMaps {
  x: number;
  y: number;
  value: number;
  page: number;
}

export default function View() {
  const router = useRouter();
  const { docId } = router.query;

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState("Meu Documento - Incorporae!");

  const [tempHeatmaps, setTempHeatmaps] = useState<HeatMaps[]>([]);


  const modalRef = useRef<HTMLDivElement>(null);
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<any>(null);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  function onPageRenderSuccess() {

    if (!pdfWrapperRef.current || !overlayRef.current) return;
    const rect = pdfWrapperRef.current.getBoundingClientRect();
    overlayRef.current.style.width = `${rect.width}px`;
    overlayRef.current.style.height = `${rect.height}px`;

    // Cria a instância do Heatmap apenas 1 vez
    if (!heatmapRef.current && overlayRef.current) {
      heatmapRef.current = h337.create({
        container: overlayRef.current,
        radius: 60,
        maxOpacity: 0.6,
        minOpacity: 0.1,
        blur: 0.75,
        
      });
    }

    setIsPageRendered(true);
  }

  useEffect(() => {
    setIsPageRendered(false);
  }, [pageNumber]);

  function prevPage() {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  }
  function nextPage() {
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
    }
  }

  useEffect(() => {
    async function fetchPdf() {
      if (!docId) return;
      try {
        const { data } = await api.get(`/file/${docId}`);
        setPdfUrl(data.url);
        setPageTitle(data.title + " - Incorporae!");
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPdf();
  }, [docId]);

  useEffect(() => {
    function updateSize() {
      if (modalRef.current) {
        const width = modalRef.current.clientWidth;
        const height = modalRef.current.clientHeight;
        setContainerWidth(width);

        // Exemplo: notifica a página pai
        window.parent.postMessage({ type: "pdf-resize", width, height }, "*");
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;

    const handleMouseMove = throttle((e: MouseEvent) => {
      
      const newPoint = {
        x: e.offsetX,
        y: e.offsetY,
        value: 1,
        page: pageNumber,
      };
      heatmapRef.current?.addData(newPoint);
      setTempHeatmaps((prev) => [...prev, newPoint]);
    }, 300)

    overlayRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      overlayRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [overlayRef.current, pageNumber]);

  useEffect(() => {
    if (!heatmapRef.current) return;


    const pointsForCurrentPage = tempHeatmaps.filter(
      (item) => item.page === pageNumber
    );

    heatmapRef.current.setData({
      max: 10,
      data: pointsForCurrentPage,
    });
  }, [pageNumber, tempHeatmaps]);


  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "h") {
        event.preventDefault(); // Evita qualquer ação padrão
  
        if (heatmapRef.current) {
          // Força atualização do Heatmap
          heatmapRef.current.repaint();
  
          setTimeout(() => {
            const heatmapData = heatmapRef.current?.getData();
            if (!heatmapData || heatmapData.data.length === 0) {
              alert("O Heatmap ainda não tem dados!");
              return;
            }
  
            const heatmapBase64 = heatmapRef.current?.getDataURL();
            const newTab = window.open();
            newTab?.document.write(`<img src="${heatmapBase64}" />`);
          }, 100);
        } else {
          alert("Erro: Heatmap ainda não está carregado.");
        }
      }
    }
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [heatmapRef]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
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
              {/* Botões de navegação (setas) */}
              {numPages && numPages > 1 && (
                <>
                  <button
                    onClick={prevPage}
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white text-2xl p-3"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={nextPage}
                    className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-black/40 text-white text-2xl p-3"
                  >
                    &rarr;
                  </button>
                </>
              )}

              <div ref={pdfWrapperRef} className="relative flex flex-col my-auto">
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page
                    key={pageNumber}
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={onPageRenderSuccess}
                    width={containerWidth || 600}
                    className={`transition-opacity duration-500 ease-in-out ${
                      isPageRendered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Document>

                {/* Overlay que fica por cima do PDF */}
                <div
                  ref={overlayRef}
                  className="!absolute top-0 left-0 pointer-events-auto bg-transparent"
                  style={{
                    zIndex: 10,
                  }}
                />
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

        {/* Paginação no rodapé */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 text-sm px-4 py-2 rounded-md z-50">
          {numPages && (
            <p>
              Página {pageNumber} de {numPages}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
