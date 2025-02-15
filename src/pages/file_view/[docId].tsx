/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

  // Chamado quando a página terminou de renderizar
  function onPageRenderSuccess() {
    if (!pdfWrapperRef.current || !overlayRef.current) return;
    const rect = pdfWrapperRef.current.getBoundingClientRect();

    // Ajusta o overlay ao tamanho do PDF
    overlayRef.current.style.width = `${rect.width}px`;
    overlayRef.current.style.height = `${rect.height}px`;

    // Cria instância do Heatmap somente 1x
    if (!heatmapRef.current) {
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

  // ======================
  //   Paginação
  // ======================
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

  // ======================
  //   Busca o PDF
  // ======================
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

  // ======================
  //   Ajusta Container
  // ======================
  useEffect(() => {
    function updateSize() {
      if (modalRef.current) {
        const width = modalRef.current.clientWidth;
        const height = modalRef.current.clientHeight;
        setContainerWidth(width);

        // Exemplo: notificar a página pai
        window.parent.postMessage({ type: "pdf-resize", width, height }, "*");
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // ======================
  //   Captura de Movimentos (sem exibir Heatmap em tempo real)
  // ======================
  useEffect(() => {
    if (!overlayRef.current) return;

    // Registramos movimentos do mouse, mas não chamamos `heatmapRef.current.setData()`
    // para não exibir no momento
    const handleMouseMove = throttle((e: MouseEvent) => {
      setTempHeatmaps((prev) => [
        ...prev,
        {
          x: e.offsetX,
          y: e.offsetY,
          value: 1,
          page: pageNumber,
        },
      ]);
    }, 300);

    overlayRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      overlayRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [overlayRef.current, pageNumber]);

  async function gerarHeatmapParaPagina(
    p: number,
    points: HeatMaps[]
  ): Promise<File> {
    return new Promise((resolve) => {
      // Cria um container off-screen
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-10000px";
      container.style.left = "-10000px";
      container.style.width = `${pdfWrapperRef.current?.clientWidth || 600}px`;
      container.style.height = `${
        pdfWrapperRef.current?.clientHeight || 800
      }px`;
      document.body.appendChild(container);

      // Cria uma nova instância de heatmap para este container
      const heatmapInstance = h337.create({
        container,
        radius: 60,
        maxOpacity: 0.6,
        minOpacity: 0.1,
        blur: 0.75,
      });

      // Define os dados e aguarda a renderização
      heatmapInstance.setData({
        max: 10,
        data: points,
        min: 0,
      });
      setTimeout(() => {
        const base64 = heatmapInstance.getDataURL();
        const fileName = `heatmap_page_${p}.png`;
        const file = dataURLtoFile(base64, fileName);
        document.body.removeChild(container);
        resolve(file);
      }, 300); // Ajuste o delay conforme necessário
    });
  }

  async function handleBeforeUnload() {
    // Se não tivermos heatmapRef, não fazemos nada
    if (!heatmapRef.current || !numPages) return;

    const heatmapLote = [];
    const formData = new FormData();

    for (let p = 1; p <= numPages; p++) {
      const pointsForPage = tempHeatmaps.filter((item) => item.page === p);

      if (pointsForPage.length === 0) continue;

      heatmapRef.current.setData({
        max: 10,
        data: pointsForPage,
      });

      const fileName = `heatmap_page_${p}.png`;
      const file = await gerarHeatmapParaPagina(p, pointsForPage);

      formData.append("heatmaps", file);
      heatmapLote.push({ page: p, fileName: fileName });
    }

    if (heatmapLote.length === 0) return;

    // Adiciona os metadados ao FormData
    formData.append("docId", docId as string);
    formData.append("metadata", JSON.stringify(heatmapLote));


    await api.post("/heatmap", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

  const dataURLtoFile = (dataurl: any, filename: any) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n) {
      u8arr[n - 1] = bstr.charCodeAt(n - 1);
      n -= 1; // to make eslint happy
    }
    return new File([u8arr], filename, { type: mime });
  };


  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="fixed top-4 right-4 text-white bg-black/60 px-4 py-2 rounded-md z-50">
          <Link href="/" target="_blank" className="font-base text-sm">
            By: <b>Incorporae!</b>
          </Link>
        </div>
        
      <div
        ref={modalRef}
        className="rounded shadow-lg max-h-screen w-full flex flex-col items-center overflow-y-auto"
      >
        {/* Se estiver carregando, mostra loader */}
        <div className="w-screen h-screen flex items-center justify-center">
              {/* Marca d'água */}
     
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

              {/* PDF + Overlay */}
              <div
                ref={pdfWrapperRef}
                className="relative flex flex-col my-auto"
              >
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

                {/* Overlay transparente (captura eventos, mas não exibe Heatmap) */}
                <div
                  ref={overlayRef}
                  className="!absolute top-0 left-0 pointer-events-auto bg-transparent"
                  style={{
                    zIndex: 10,
                    opacity: 0
                  }}
                />
              </div>
            </>
          )}
        </div>

    

        {/* Paginação no rodapé */}
        <div
          onClick={handleBeforeUnload}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 text-sm px-4 py-2 rounded-md z-50"
        >
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
