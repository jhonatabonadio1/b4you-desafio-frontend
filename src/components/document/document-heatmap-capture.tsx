/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { throttle } from "lodash";
import {  RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { api } from "@/services/apiClient";
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
import { MoonLoader } from "react-spinners";

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

export function DocumentHeatmapCapture({ pdfUrl, docId, fullscreenRef }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [pages, setPages] = useState<PagesProps[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (containerRef.current && pages.length > 0) {
      const { width } = pages[0];
      setScale(containerRef.current.clientWidth / width);
    }
  }, [containerWidth, pages]);


  const [zoom, setZoom] = useState(1); // fator de zoom que o usuário controla

  function zoomIn() {
    const max = 2
    setZoom((prev) => prev < max ? prev * 1.2 : prev);
  }

  function zoomOut() {
    const max = 1
    setZoom((prev) => prev > max ? prev / 1.2 : prev);
  }

  const [alreadyCreatedWebsocket, setAlreadyCreatedWebsocket] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLCanvasElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);


  useEffect(() => {
    if (!isFullscreen) {
     
      sessionStorage.removeItem("heatmaps");
    }
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

  useEffect(() => {
    const targetElement =  containerRef.current;
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
    }
  
    targetElement.addEventListener("mousemove", mouseMoveListener);
    targetElement.addEventListener("touchmove", touchMoveListener, { passive: true });
  
    return () => {
      targetElement.removeEventListener("mousemove", mouseMoveListener);
      targetElement.removeEventListener("touchmove", touchMoveListener);
    };
  }, [isFullscreen, zoom, pageNumber, pages, scale, containerRef, pageRef]);
  
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
    if (!document.fullscreenElement) {
      fullscreenRef.current
        ?.requestFullscreen()
        .catch((err) =>
          console.error("Erro ao tentar entrar no modo fullscreen:", err)
        );
    } else {
      document.exitFullscreen().catch((err) =>
        console.error("Erro ao tentar sair do modo fullscreen:", err)
      );
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
            <MoonLoader size={34} />
          </div>
        }
      >
        <Page
          canvasRef={pageRef}
        
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
      <div className="fixed pointer-events-auto bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 p-2 rounded-full bg-card lg:w-autobg-background shadow-md origin-center animate-expandHorizontal">
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
          >
            <Fullscreen />
          </button>
        </div>
      </div>
    )}

</>
  );
}
