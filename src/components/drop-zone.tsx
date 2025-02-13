/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/button";
import { useState } from "react";

import Dropzone from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useRouter } from "next/router";

export function DropZone() {
  const [file, setFile] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [authModal, setAuthModal] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null as string | null);

  const route = useRouter();

  // Quando o usuário arrasta um arquivo válido PDF e solta
  const handleFileUpload = (acceptedFiles: any) => {
    // Assim que solta, remove o estado de "arrastando"
    setIsDragging(false);

    const uploadedFile = acceptedFiles[0];

    // Se não existe arquivo ou não for PDF
    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      setFileError("É permitido apenas arquivos PDF.");
      return;
    } else {
      setFileError(null);
    }

    // Verifica se o arquivo ultrapassa 10MB
    if (uploadedFile.size > 10 * 1024 * 1024) {
      setErrorModal(true);
      return;
    }

    // Simula loading de 2 segundos
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFile(uploadedFile);
    }, 2000);
  };

  return (
    <>
      <div className="mt-4 w-full max-w-4xl mx-auto">
        {/* Área de Dropzone */}
        {!file && (
          <Dropzone
            onDrop={handleFileUpload}
            accept={{ "application/pdf": [".pdf"] }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            maxFiles={1}
          >
            {({ getRootProps, getInputProps }) => (
              <Card
                {...getRootProps()}
                className={`items-center bg-background ${
                  isDragging && "border-blue-500"
                } justify-center flex flex-col h-[200px]`}
              >
                <input {...getInputProps()} />
                {isDragging ? (
                  <p className="text-lg text-muted-foreground">
                    Solte o arquivo
                  </p>
                ) : loading ? (
                  <p className="text-lg text-muted-foreground">Carregando...</p>
                ) : (
                  <>
                    <CardHeader className="pb-4 flex-col items-center gap-1">
                      <Button>Fazer Upload</Button>
                      <p className="text-sm text-muted-foreground">
                        (Max 10MB)
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground">
                        ou arraste e solte aqui
                      </p>
                    </CardContent>
                  </>
                )}
              </Card>
            )}
          </Dropzone>
        )}

        {fileError && (
          <p className="mt-3 text-red-500 text-sm text-center">{fileError}</p>
        )}

        {/* Exibição do arquivo selecionado */}
        {file && (
          <div className="mt-4 p-2 bg-primary-foreground rounded-lg w-full text-center border">
            <p className="font-semibold">{file.name}</p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2 mt-4 justify-end">
          {/* Botão Incorporae! abre o modal de pré-visualização */}
          {file && (
            <Button
              disabled={!file}
              style={{
                opacity: !file ? 0.5 : 1,
                cursor: !file ? "not-allowed" : "pointer",
              }}
              onClick={() => route.push("/signup")}
            >
              Continuar
            </Button>
          )}

          {/* Botão remover arquivo */}
          {file && (
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setFileError(null);
              }}
            >
              Remover arquivo
            </Button>
          )}
        </div>
      </div>

      <Dialog open={errorModal} onOpenChange={setErrorModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arquivo muito grande!</DialogTitle>
            <DialogDescription>
              Apenas usuários Pro podem fazer upload de arquivos maiores que
              10MB.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setErrorModal(false)}>Fechar</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={authModal} onOpenChange={setAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Para continuar, faça login</DialogTitle>
            <DialogDescription>
              Para continuar o upload do seu PDF, faça login ou crie uma conta
              gratuitamente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={() => console.log("Redirecionar para login")}>
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("Redirecionar para cadastro")}
            >
              Cadastre-se
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
