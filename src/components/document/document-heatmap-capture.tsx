/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { throttle } from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { api } from "@/services/apiClient";
import { io, Socket} from "socket.io-client";

import {
  ChevronLeft,
  ChevronRight,
  Fullscreen,
  MoonIcon,
  SunIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { useMetaColor } from "@/hooks/use-meta-color";
import { useTheme } from "next-themes";
import { META_THEME_COLORS } from "@/config/site";

import { Icons } from "../icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  pdfUrl: string;
  docId: string;
  fullscreenRef: RefObject<HTMLDivElement | null>;
}

interface PagesProps {
  width: number;
  height: number;
  page: number;
}

export function DocumentHeatmapCapture({
  pdfUrl,
  docId,
  fullscreenRef,
}: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (containerRef.current && pages.length > 0) {
      const { width } = pages[0];
      setScale(containerRef.current.clientWidth / width);
    }
  }, [containerWidth, pages]);

  const [zoom, setZoom] = useState(1); // fator de zoom que o usuário controla

  function zoomIn() {
    const max = 2;
    setZoom((prev) => (prev < max ? prev * 1.2 : prev));
  }

  function zoomOut() {
    const max = 1;
    setZoom((prev) => (prev > max ? prev / 1.2 : prev));
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLCanvasElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const socketRef = useRef<Socket | null>(null); // Ref para armazenar a conexão WebSocket

  useEffect(() => {
   

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  function openWebSocket(sessionId: string) {
    if (!socketRef.current) {
      // Criar a conexão apenas UMA VEZ
      socketRef.current = io("https://api.incorporae.com.br", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ WebSocket conectado!", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket desconectado.");
      });

      socketRef.current.emit("joinDocumentRoom", {
        documentId: docId,
        sessionId: sessionId,
        fingerprint: navigator.userAgent,
      });

      socketRef.current.emit("pageChange", { pageNumber });
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      sessionStorage.removeItem("heatmaps");
    }
  }, []);

  async function createSession() {
    try {
      const response = await api.post("/sessions", { docId });
      setSessionId(response.data.sessionId);
      openWebSocket(response.data.sessionId);
    } catch (error) {
      console.log("[SESSION] Erro ao criar sessão:", error);
    }
  }

  async function sendMessage() {
    if(socketRef.current){
      socketRef.current.emit("pageChange", { pageNumber });
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
    createSession();

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
    sendMessage();
  }, [pageNumber]);

  function prevPage() {
    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
  }

  function nextPage() {
    if (numPages && pageNumber < numPages) setPageNumber((prev) => prev + 1);
  }

  useEffect(() => {
    if (!isPageRendered) return;

    const targetElement = containerRef.current;
    if (!targetElement || pages.length === 0 || !pageRef.current) return;

    const throttledMouseMove = throttle((e: MouseEvent) => {
      const rect = pageRef.current!.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      if (isFullscreen) {
        // Calcula a escala baseada nas dimensões originais do PDF
        const scaleX = rect.width / pages[0].width;
        const scaleY = rect.height / pages[0].height;
        const effectiveScale = Math.min(scaleX, scaleY);

        // Calcula a área efetivamente renderizada do PDF
        const renderedWidth = pages[0].width * effectiveScale;
        const renderedHeight = pages[0].height * effectiveScale;

        // Determina os offsets (margens) gerados ao centralizar o PDF no canvas
        const offsetX = (rect.width - renderedWidth) / 2;
        const offsetY = (rect.height - renderedHeight) / 2;

        // Ajusta as coordenadas removendo o offset
        x = x - offsetX;
        y = y - offsetY;
      }

      processMovement(x, y);
    }, 300);

    // Função wrapper que recebe um Event, converte para MouseEvent e chama a função throttled
    const mouseMoveListener = (e: Event) => {
      throttledMouseMove(e as MouseEvent);
    };

    const handleTouchMove = throttle((e: TouchEvent) => {
      // Usamos o primeiro toque para capturar as coordenadas
      const touch = e.touches[0];
      const rect = pageRef.current!.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      processMovement(x, y);
    }, 300);

    const touchMoveListener = (e: Event) => {
      handleTouchMove(e as TouchEvent);
    };

    targetElement.addEventListener("mousemove", mouseMoveListener);
    targetElement.addEventListener("touchmove", touchMoveListener, {
      passive: true,
    });

    return () => {
      targetElement.removeEventListener("mousemove", mouseMoveListener);
      targetElement.removeEventListener("touchmove", touchMoveListener);
    };
  }, [
    isFullscreen,
    zoom,
    pageNumber,
    pages,
    scale,
    containerRef,
    pageRef,
    isPageRendered,
  ]);

  function processMovement(x: number, y: number) {
    const currentPage = pages.find((p) => p.page === pageNumber);
    if (!currentPage) return;

    let effectiveScale: number;

    if (isFullscreen && pageRef.current) {
      // Obter as dimensões reais do canvas
      const rect = pageRef.current.getBoundingClientRect();
      // Calcula a escala para largura e altura
      const scaleX = rect.width / pages[0].width;
      const scaleY = rect.height / pages[0].height;
      effectiveScale = Math.min(scaleX, scaleY);

      // Calcula o tamanho real renderizado do PDF
      const renderedWidth = pages[0].width * effectiveScale;
      const renderedHeight = pages[0].height * effectiveScale;

      // Determina os offsets (margens) se o PDF estiver centralizado (letterboxing)
      const offsetX = (rect.width - renderedWidth) / 2;
      const offsetY = (rect.height - renderedHeight) / 2;

      // Ajusta as coordenadas removendo os offsets
      x = x - offsetX;
      y = y - offsetY;
    } else if (containerRef.current) {
      effectiveScale = containerRef.current.clientWidth / pages[0].width;
    } else {
      effectiveScale = scale;
    }

    // Se não estiver em fullscreen, a conversão precisa considerar o zoom (pois o container não reflete o zoom aplicado)
    // Em fullscreen, effectiveScale já inclui o zoom.
    const divisor = isFullscreen ? effectiveScale : effectiveScale * zoom;
    const originalX = x / divisor;
    const originalY = y / divisor;

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
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (sessionId) {
      console.log("Intervalo iniciado");
      interval = setInterval(enviaLote, 15000);
    }
    return () => clearInterval(interval);
  }, [sessionId]);

  async function enviaLote() {
    const heatmaps = JSON.parse(sessionStorage.getItem("heatmaps") || "[]");
   
    if (heatmaps.length === 0) {

      return;
    }
  
    try {

      await api.post("/heatmaps/lote", { docId, sessionId, lote: heatmaps });
     
      sessionStorage.removeItem("heatmaps");
    } catch (error: any) {
      console.error("[HEATMAP] Erro ao enviar lote:", error);
    }
  }
  

  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  function toggleFullScreen() {
    if (document.fullscreenEnabled) {
      if (!document.fullscreenElement) {
        fullscreenRef.current
          ?.requestFullscreen()
          .catch((err) =>
            console.log("Erro ao tentar entrar no modo fullscreen:", err)
          );
      } else {
        document
          .exitFullscreen()
          .catch((err) =>
            console.log("Erro ao tentar sair do modo fullscreen:", err)
          );
      }
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        id="container"
        className="w-full relative max-h-screen overflow-auto"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="fixed inset-0 flex items-center justify-center z-60">
              <Icons.spinner className="text-primary animate-spin" />
            </div>
          }
        >
          <Page
            canvasRef={pageRef}
            loading=""
            key={pageNumber}
            pageNumber={pageNumber}
            renderTextLayer={false}
            scale={1 * zoom}
            renderAnnotationLayer={false}
            width={containerWidth || undefined} // Escala automática para tela
            onRenderSuccess={onPageRenderSuccess}
            className={`transition-opacity duration-500 ease-in-out z-70 ${
              isPageRendered ? "opacity-100" : "opacity-0"
            }`}
          />
        </Document>
      </div>
      {numPages && (
        <div className="fixed bottom-4 left-0 w-full px-4">
          <div className="flex justify-center items-center gap-4 w-full max-w-[400px] mx-auto">
            <div className="flex w-full  justify-around items-center gap-2 p-2 rounded-full bg-card lg:w-autobg-background shadow-md origin-center animate-expandHorizontal">
              <button
                onClick={zoomIn}
                className="bg-transparent hover:bg-foreground hover:text-primary-foreground transition border border-border text-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.50s" }}
              >
                <ZoomIn />
              </button>

              <button
                onClick={zoomOut}
                className="bg-transparent hover:bg-foreground hover:text-primary-foreground transition border border-border text-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.25s" }}
              >
                <ZoomOut />
              </button>

              <button
                onClick={prevPage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <ChevronLeft />
              </button>

              <span
                className="text-foreground opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.75s" }}
              >
                {pageNumber} de {numPages}
              </span>

              <button
                onClick={nextPage}
                disabled={numPages <= 1}
                className="bg-primary hover:bg-primary/90  text-primary-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <ChevronRight />
              </button>

              <button
                onClick={toggleTheme}
                className="bg-transparent hover:bg-foreground hover:text-primary-foreground transition border border-border text-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.25s" }}
              >
                <SunIcon className="hidden dark:block" />
                <MoonIcon className="block dark:hidden" />
              </button>

              <button
                onClick={toggleFullScreen}
                className="bg-transparent hover:bg-foreground hover:text-primary-foreground transition border border-border text-foreground p-2 rounded-full opacity-0 animate-fadeIn"
                style={{ animationDelay: "0.50s" }}
                disabled={!document.fullscreenEnabled}
              >
                <Fullscreen />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
