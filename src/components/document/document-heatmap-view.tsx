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
  pdfUrl: string;
  docId: string;
  onLoad: (doc: any) => void;
  page: number;
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

export function DocumentHeatmapView({ pdfUrl, docId, page, onLoad }: Props) {

  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);

  // Referências
  const pageRef = useRef<HTMLCanvasElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  const [lote, setLote] = useState([] as LoteProps[]);

  // 1. Buscar a URL do PDF

  // Atualiza as dimensões do container
  useEffect(() => {
    function updateContainerWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }

    updateContainerWidth();
  }, []);

  // 2. Quando o PDF carrega, pegamos as dimensões de cada página na escala 1
  async function onDocumentLoadSuccess(pdf: any) {
    onLoad(pdf)

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
    buscaLoteHeatmaps(page);
  }

  // 4. Sempre que a página mudar, recarregamos os heatmaps daquela página
  useEffect(() => {
    if (page && pages.length > 0) {
      clearHeatmap();
      buscaLoteHeatmaps(page);
    }
  }, [pdfUrl, page, pages]);

  async function buscaLoteHeatmaps(page: number) {
    try {
      const { data } = await api.get(`/heatmaps/${docId}/${page}`);

      if (data) {
        const allHeatmaps = data.flatMap((lote: any) => lote.Heatmaps);

        // Agora chamamos createHeatmap com TODOS os heatmaps.
        setLote(allHeatmaps);
      } else {
      }
    } catch (error) {
      console.error("Erro ao buscar heatmaps:", error);
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
  }, [page]);

  // 7. Cria o heatmap com h337, ajustando o container e escalando as coords

  useEffect(() => {
    function createHeatmap() {
      if (!heatmapRef.current || !pageRef.current) return;

      const pdfRect = pageRef.current.getBoundingClientRect();

      // Ajustar o tamanho do container do heatmap para cobrir a página corretamente
      heatmapRef.current.style.width = `${pdfRect.width}px`;
      heatmapRef.current.style.height = `${pdfRect.height}px`;
      heatmapRef.current.innerHTML = ""; // Limpa o heatmap anterior

      // Criar nova instância do heatmap
      const heatmap = h337.create({
        container: heatmapRef.current,
        radius:
          containerWidth < 680
            ? 20
            : containerWidth > 900 && containerWidth < 1300
            ? 40
            : 50, // Agora atualiza dinamicamente
        maxOpacity: 0.7,
        minOpacity: 0.1,
        blur: 1,
      });

      // Converter coordenadas do PDF para o tamanho da página na tela
      const scaledData = lote.map((point) => {
        const scaledX = Math.round((point.x / point.pageWidth) * pdfRect.width);
        const scaledY = Math.round(
          (point.y / point.pageHeight) * pdfRect.height
        );
        return { x: scaledX, y: scaledY, value: 1 };
      });

      // Definir os dados no heatmap
      heatmap.setData({ max: 5, min: 0, data: scaledData });
    }

    // Criar o heatmap na inicialização se já tivermos os dados
    if (lote.length > 0) {
      createHeatmap();
    }
  }, [page, lote]);

  // 8. Render
  return (
    <div ref={containerRef} className="relative max-w-full">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {/* Renderiza a página do PDF */}
        <Page
          canvasRef={pageRef}
          key={page}
          pageNumber={page}
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
        className="pointer-events-none !absolute top-0 left-0 bg-black/5"
      />
    </div>
  );
}
