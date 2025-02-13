/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MoonLoader } from 'react-spinners';

// Configuração do worker do PDF.js (CDN oficial)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function View() {
 

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [isPageRendered, setIsPageRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Referência para o modal
  const modalRef = useRef<HTMLDivElement>(null);

  // Atualiza tamanho do PDF e envia para o site que incorporou
  useEffect(() => {
    function updateSize() {
      if (modalRef.current) {
        const width = modalRef.current.clientWidth;
        const height = modalRef.current.clientHeight;
        setContainerWidth(width);
        
        // Enviar tamanho do iframe para o site pai
        window.parent.postMessage({ type: "pdf-resize", width, height }, "*");
      }
    }

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Quando o PDF carrega, define o número de páginas e desativa o loading
  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoading(false);
  }

  // Fade-in quando a página renderiza
  function onPageRenderSuccess() {
    setIsPageRendered(true);
  }

  useEffect(() => {
    setIsPageRendered(false);
  }, [pageNumber]);

  // Navegação
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

  return (
    <>
      {/* Overlay (fundo escuro) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen">
        <div ref={modalRef} className="relative rounded shadow-lg h-full w-full flex flex-col items-center">
          {/* Área do PDF */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {/* Se estiver carregando, exibe o spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-60">
                <MoonLoader color="#FFF" size={34}/>
              </div>
            )}

            {/* Setas de Navegação */}
            <button
              onClick={prevPage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white text-2xl p-3"
              title="Página anterior"
            >
              &larr;
            </button>

            <button
              onClick={nextPage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white text-2xl p-3"
              title="Próxima página"
            >
              &rarr;
            </button>

            {/* Documento PDF */}
            <Document
              file="/testfile.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
            >
              <Page
                key={pageNumber}
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={onPageRenderSuccess}
                width={containerWidth || 600}
                className={`transition-opacity duration-500 ease-in-out ${
                  isPageRendered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Document>
          </div>

          <div className="absolute top-4 right-4 text-white bg-black/60 px-4 py-2 rounded-md">
           
                
              <Link href="/" target="_blank" className='font-base text-sm'>
                By: <b>Incorporae!</b>
              </Link>
    
          </div>

          {/* Paginação centralizada no rodapé */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 text-sm px-4 py-2 rounded-md">
            {numPages && (
              <p>
                Página {pageNumber} de {numPages}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
