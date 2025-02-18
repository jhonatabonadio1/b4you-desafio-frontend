/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { throttle } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
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

export function DocumentHeatmapCapture({ pdfUrl, docId }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [alreadyCreatedWebsocket, setAlreadyCreatedWebsocket] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    sessionStorage.removeItem("heatmaps");
    createSession();
  }, []);

  async function createSession() {
    try {
      const response = await api.post("/sessions", { docId });
      setSessionId(response.data.sessionId);
    } catch (error) {
      console.log("[SESSION] Erro ao criar sessão:", error);
    }
  }

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

    if (pdf.numPages === 1) {
      if (!alreadyCreatedWebsocket) {
        openWebSocket();
      }
    }

    const pageWithDimensions: PagesProps[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const pageObj = await pdf.getPage(i);
      const viewport = pageObj.getViewport({ scale: 1 });

      pageWithDimensions.push({
        width: viewport.width,
        height: viewport.height,
        page: i,
      });
    }

    setPages(pageWithDimensions);

    if (containerRef.current && pageWithDimensions.length > 0) {
      const { width } = pageWithDimensions[0];
      setScale(containerRef.current.clientWidth / width);
    }
  }

  function onPageRenderSuccess() {
    setIsPageRendered(true);
  }

  useEffect(() => {
    setIsPageRendered(false);
  }, [pageNumber]);

  function prevPage() {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  }

  function nextPage() {
    if (numPages && pageNumber < numPages) setPageNumber((prev) => prev + 1);
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

      const originalX = x / scale;
      const originalY = y / scale;

      const newHeatmapData = {
        x: originalX,
        y: originalY,
        value: 1,
        pageWidth: currentPage.width,
        pageHeight: currentPage.height,
        page: pageNumber,
      };

      const heatmaps = JSON.parse(sessionStorage.getItem("heatmaps") || "[]");
      heatmaps.push(newHeatmapData);
      sessionStorage.setItem("heatmaps", JSON.stringify(heatmaps));
    }, 300);

    pageRef.current.addEventListener("mousemove", handleMouseMove);
    return () =>
      pageRef.current?.removeEventListener("mousemove", handleMouseMove);
  }, [pageRef.current, pageNumber, pages, scale]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPageRendered) {
      console.log("Intervalo iniciado");
      interval = setInterval(enviaLote, 60000);
    }
    return () => clearInterval(interval);
  }, [isPageRendered]);

  async function enviaLote() {
    const heatmaps = JSON.parse(sessionStorage.getItem("heatmaps") || "[]");
    if (heatmaps.length === 0 || !sessionId) {
      return;
    }

    try {
      await api.post("/heatmaps/lote", { docId, sessionId, lote: heatmaps });
      sessionStorage.removeItem("heatmaps");
    } catch (error: any) {
      console.error(
        "[HEATMAP] Erro ao enviar lote:",
        error.response?.data?.message || "Erro desconhecido"
      );
    }
  }

  //** TRAQUEAMENTO + TEMPO DE INTERAÇÃO */
  useEffect(() => {
    if (isPageRendered) {
      setStartTime(Date.now());
    }
  }, [pageNumber, isPageRendered]);

  async function handleSendPageView() {
    if (!startTime || !sessionId) return;

    const timeSpent = Date.now() - startTime;

    try {
      const data = { pageNumber, interactionTime: timeSpent / 1000 };

      await api.post("/tracking/" + sessionId + "/pageview", data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (pageNumber > 1) {
      handleSendPageView();
    }
  }, [pageNumber]);

  function openWebSocket() {
    if (!sessionId) return;

    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      setAlreadyCreatedWebsocket(true);
      console.log("✅ WebSocket conectado!");
      setStartTime(Date.now());

      // Enviar ID da sessão e docId para o backend
      socket.send(
        JSON.stringify({
          sessionId,
          docId,
          fingerprint: navigator.userAgent,
          pageNumber: 1,
        })
      );
    };

    setWs(socket);
  }

  useEffect(() => {
    if (!numPages) return;
    if (numPages > 1) {
      if (pageNumber === numPages) {
        if (!alreadyCreatedWebsocket) {
          openWebSocket();
        }
      } else if (pageNumber === numPages - 1 && ws) {
        closeWebSocket(); 
      }
    }
  }, [pageNumber, numPages]);

  function closeWebSocket() {
    if (ws) {
      console.log("❌ WebSocket fechado!");
      ws.close();
      setWs(null);
    }
  }

  useEffect(() => {
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

  return (
    <div
      ref={containerRef}
      className="w-full relative max-h-screen overflow-auto"
    >
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
    </div>
  );
}
