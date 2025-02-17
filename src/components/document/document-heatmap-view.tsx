/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import h337 from "heatmap.js";
import { api } from "@/services/apiClient";

// Configuração do worker do PDF
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Tipos
interface Props {
  docId: string;
  onLoad: (doc: any) => void;
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
  pageWidth: number; // <-- Precisamos para escalar
  pageHeight: number; // <-- Precisamos para escalar
}

export function DocumentHeatmapView({ docId, onLoad }: Props) {
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");

  // Referências
  const pageRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  // 1. Buscar a URL do PDF
  useEffect(() => {
    async function fetchDocument() {
      try {
        const { data } = await api.get(`/file/${docId}`);
        setPdfUrl(data.url);
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
      }
    }
    fetchDocument();
  }, [docId]);

  // 2. Quando o PDF carrega, pegamos as dimensões de cada página na escala 1
  async function onDocumentLoadSuccess(pdf: any) {
    onLoad(pdf);
    setPageNumber(1);

    const pageDimensions: PagesProps[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const pageObj = await pdf.getPage(i);
      const viewport = pageObj.getViewport({ scale: 1 });
      pageDimensions.push({
        width: viewport.width,
        height: viewport.height,
        page: i,
      });
    }
    setPages(pageDimensions);

    // Carregar heatmaps da página 1
    buscaLoteHeatmaps(1);
  }

  // 4. Sempre que a página mudar, recarregamos os heatmaps daquela página
  useEffect(() => {
    if (pageNumber && pages.length > 0) {
      buscaLoteHeatmaps(pageNumber);
    }
  }, [docId, pageNumber, pages]);

  async function buscaLoteHeatmaps(page: number) {

    try {
      const { data } = await api.get(`/heatmaps/${docId}/${page}`);
     
      if (data) {
        const allHeatmaps = data.flatMap((lote: any) => lote.Heatmaps);

        // Agora chamamos createHeatmap com TODOS os heatmaps.
        createHeatmap(allHeatmaps);
      } else {
    
        clearHeatmap();
      }
    } catch (error) {
      console.error("Erro ao buscar heatmaps:", error);
      clearHeatmap();
    }
  }

  function clearHeatmap() {
    if (heatmapRef.current) {
      heatmapRef.current.innerHTML = "";
    }
  }

  // 6. Renderização da página
  function onPageRenderSuccess() {
  
    setIsPageRendered(true);
  }

  useEffect(() => {
    setIsPageRendered(false);
  }, [pageNumber]);

  // 7. Cria o heatmap com h337, ajustando o container e escalando as coords
  function createHeatmap(lote: LoteProps[]) {
    if (!heatmapRef.current || !pageRef.current) return;

    // 1. Pegar o tamanho real do canvas do PDF (em pixels na tela)
    const pdfRect = pageRef.current.getBoundingClientRect();

    // Ajustar o container do heatmap para ter esse tamanho
    heatmapRef.current.style.width = `${pdfRect.width}px`;
    heatmapRef.current.style.height = `${pdfRect.height}px`;

    // Limpar qualquer heatmap anterior
    heatmapRef.current.innerHTML = "";

    // 2. Criar instância do heatmap
    const heatmap = h337.create({
      container: heatmapRef.current,
      radius: 40,
      maxOpacity: 0.7,
      minOpacity: 0.1,
      blur: 0.75,
    });

    // 3. Escalar as coordenadas do PDF para o tamanho do container
    //    Supondo que cada "point" tenha "pageWidth" e "pageHeight"
    const scaledData = lote.map((point) => {
      // Se "x" e "y" são do espaço PDF (0..pageWidth, 0..pageHeight),
      // converta para o espaço do container (0..pdfRect.width, 0..pdfRect.height)
      const scaledX = Math.round((point.x / point.pageWidth) * pdfRect.width);
      const scaledY = Math.round((point.y / point.pageHeight) * pdfRect.height);

      return {
        x: scaledX,

        y: scaledY,
        value: 1,
      };
    });

    // 4. Passar dados para o heatmap
    heatmap.setData({
      max: 5,
      min: 0,
      data: scaledData,
    });
  }

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [pageNumber, isPageRendered]);

  // 8. Render
  return (
    <div ref={containerRef} className="relative max-w-full">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {/* Renderiza a página do PDF */}
        <Page
          canvasRef={pageRef}
          key={pageNumber}
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={containerWidth}
          onRenderSuccess={onPageRenderSuccess}
          className={`transition-opacity duration-500 ease-in-out ${
            isPageRendered ? "opacity-100" : "opacity-0"
          }`}
        />
      </Document>

      {/* Overlay do Heatmap, absoluto sobre a página */}
      <div
        ref={heatmapRef}
        className="pointer-events-none !absolute top-0 left-0 "
      />
    </div>
  );
}
