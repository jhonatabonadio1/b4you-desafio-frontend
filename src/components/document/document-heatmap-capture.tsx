/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { throttle } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "../ui/button";
import { api } from "@/services/apiClient";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  pdfUrl: string;
  docId: string;
}

interface PagesProps {
  width: number;
  height: number;
  page: number;
}

interface LoteProps {
  x: number;
  y: number;
  value: number;
  page: number;
  pageWidth: number;
  pageHeight: number;
}

export function DocumentHeatmapCapture({ pdfUrl, docId }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);
  const [loteHeatmaps, setLoteHeatmaps] = useState<LoteProps[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const [scale, setScale] = useState(1); // Escala do PDF renderizado

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLCanvasElement>(null);

  // Atualiza as dimensões do container
  useEffect(() => {
    function updateContainerWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);

      }
    }

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  async function onDocumentLoadSuccess(pdf: any) {
    setNumPages(pdf.numPages);
    setPageNumber(1);

    const pageWithDimensions: PagesProps[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const pageObj = await pdf.getPage(i);
      const viewport = pageObj.getViewport({ scale: 1 }); // Tamanho real do PDF

      pageWithDimensions.push({
        width: viewport.width,
        height: viewport.height,
        page: i,
      });
    }

    setPages(pageWithDimensions);

    // Atualiza a escala com base no tamanho real do PDF e do container
    if (containerRef.current && pageWithDimensions.length > 0) {
      const { width } = pageWithDimensions[0];
      const newScale = containerRef.current.clientWidth / width;
      setScale(newScale);
    }
  }

  function onPageRenderSuccess() {
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

  // Capturar os movimentos do mouse corretamente
  useEffect(() => {
    if (!pageRef.current || pages.length === 0) return;

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!pageRef.current) return;
      const rect = pageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const currentPage = pages.find((p) => p.page === pageNumber);
      if (!currentPage) return;

      // **🔴 Reverter a escala para capturar coordenadas no tamanho real do PDF**
      const originalX = x / scale;
      const originalY = y / scale;

      setLoteHeatmaps((prevHeatmaps) => [
        ...prevHeatmaps,
        {
          x: originalX,
          y: originalY,
          value: 1,
          pageWidth: currentPage.width,
          pageHeight: currentPage.height,
          page: pageNumber,
        },
      ]);
    }, 300);

    pageRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      pageRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [pageRef.current, pageNumber, pages, scale]); // Adiciona `scale` para atualizar corretamente

  async function enviaLote() {
    try {
      await api.post("/heatmaps/lote", {
        docId,
        lote: loteHeatmaps,
      });

      window.alert("Lote enviado com sucesso");
    } catch (error: any) {
      window.alert(error.response?.data?.message || "Erro ao enviar lote");
    }
  }

  return (
    <div ref={containerRef} className="w-full relative max-h-screen overflow-auto">
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
  
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          canvasRef={pageRef}
          key={pageNumber}
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={containerWidth || undefined} // Escala automática para tela
          onRenderSuccess={onPageRenderSuccess}
          className={`transition-opacity duration-500 ease-in-out ${
            isPageRendered ? "opacity-100" : "opacity-0"
          }`}
        />
      </Document>


      <Button onClick={enviaLote} className="mt-4">Enviar Lote</Button>
    </div>
  );
}
