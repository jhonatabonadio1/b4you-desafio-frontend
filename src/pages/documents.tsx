/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { Check, Clipboard, Plus, Trash, Upload } from "lucide-react";
import Head from "next/head";
import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Icons } from "@/components/icons";
import { useDeleteFile, useFiles, useUploadFile } from "@/services/hooks/files";
import Storage from "@/components/storage";

export default function Documents() {
  const [search, setSearch] = useState("");

  const { data: serverFiles = [], isLoading } = useFiles(search);
  const deleteFile = useDeleteFile();

  const uploadFile = useUploadFile();

  const [uploadingFiles, setUploadingFiles] = useState<
    {
      id?: string;
      name: string;
      size: string;
      date: string;
      status: "loading" | "done";
      url?: string;
    }[]
  >([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
          date: new Date().toLocaleString(),
          status: "loading" as const,
        };

        setUploadingFiles((prev) => [newFile, ...prev]);

        try {
          const { id, title, sizeInBytes } = await uploadFile.mutateAsync(file);

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.name === title
                ? {
                    ...f,
                    id,
                    status: "done",
                    size: `${(sizeInBytes / 1024 / 1024).toFixed(2)}MB`,
                  }
                : f
            )
          );
        } catch (error) {
          console.log("Erro ao enviar o arquivo:", error);
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFile = async (doc: any) => {
    setIsDeleting(true);
    try {
      await deleteFile.mutateAsync(doc.id);
      setUploadingFiles((prev) =>
        prev.filter((item) => item.name !== doc.name)
      );
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServerFiles = serverFiles.filter(
    (file: any) => !uploadingFiles.some((upload) => upload.name === file.title)
  );

  const [copied, setCopied] = useState(false);

  const handleCopy = (embedCode: string) => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000); // Reseta o estado após 2s
  };

  return (
    <>
      <Head>
        <title>Meus Documentos - Incorporae!</title>
      </Head>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-gradient-to-tr from-primary-foreground via-background to-background">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex flex-row items-center w-full justify-between px-4 gap-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-mx-1" />
                <div className="hidden md:flex items-center gap-1">
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">
                          Meus documentos
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Input
                  type="search"
                  placeholder="Buscar documentos..."
                  className="text-sm w-full lg:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <ModeSwitcher />
              </div>
            </div>
          </header>
          <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
            <header className="flex flex-col lg:flex-row items-center gap-4 w-full justify-between border-b py-4">
              <div>
                <h2 className="text-3xl font-bold">Documentos</h2>
                <p className="text-muted-foreground">
                  Confira todos os documentos já enviados.
                </p>
              </div>
              <div>
                <input {...getInputProps()} ref={fileInputRef} />
                <Button onClick={handleButtonClick}>
                  <Upload />
                  Enviar documento
                </Button>
              </div>
            </header>

            {isLoading && (
              <div className="flex items-center justify-center">
                <Icons.spinner className="animate-spin" />
              </div>
            )}

            <div {...getRootProps()} className="relative h-full w-full">
              {isDragActive && (
                <div className="border-2 z-10 border-blue-500 border-dashed absolute top-0 left-0 w-full h-full flex justify-center items-center bg-foreground/10 rounded-xl">
                  <span className="text-3xl font-bold">Solte o arquivo</span>
                </div>
              )}

              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                {uploadingFiles.map((file, index) => (
                  <Card
                    key={index}
                    className="flex flex-col justify-between relative aspect-video"
                  >
                    {file.status === "loading" ? (
                      <div className="flex w-full h-full items-center justify-center absolute top-0 left-0">
                        <Icons.spinner className="animate-spin" />
                      </div>
                    ) : (
                      <>
                        <CardHeader>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row items-center gap-2">
                              <span className="truncate">{file.name}</span>
                              <Badge>{file.size}</Badge>
                            </div>
                            <small className="text-muted-foreground">
                              {file.date}
                            </small>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {file.status === "done" && (
                            <div className="flex items-center justify-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="w-full">Incorporar</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Código de incorporação
                                    </DialogTitle>
                                    <DialogDescription>
                                      Copie o código abaixo e cole entre as tags
                                      &lt;body&gt;&lt;/body&gt; do seu site.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea
                                    rows={4}
                                    className="text-muted-foreground"
                                    readOnly
                                  >{`<iframe src="http://localhost:3000/file_view/${file.id}" width="1280" height="720"></iframe>`}</Textarea>
                                 <DialogFooter>
                              <Button
                                onClick={() =>
                                  handleCopy(
                                    `<iframe src="http://localhost:3000/file_view/${file.id}" width="1280" height="720"></iframe>`
                                  )
                                }
                              >
                                {copied ? <Check /> : <Clipboard />}
                                {copied ? "Copiado!" : "Copiar"}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Fechar</Button>
                              </DialogClose>
                            </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline">
                                    <Trash />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Tem certeza?</DialogTitle>
                                    <DialogDescription>
                                      Ao excluir, não será mais possível
                                      visualizar o arquivo em nenhum site que
                                      esteja incorporado e nem restaurá-lo no
                                      futuro.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => handleDeleteFile(file)}
                                      variant="destructive"
                                    >
                                      Sim, tenho certeza
                                    </Button>
                                    <DialogClose asChild>
                                      <Button variant="outline">Fechar</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}

                {filteredServerFiles.map((file: any) => (
                  <Card
                    key={file.id}
                    className="flex flex-col justify-between relative aspect-video"
                  >
                    <CardHeader>
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row items-center gap-2">
                          <span className="truncate">{file.title}</span>
                          <Badge>
                            {(file.sizeInBytes / 1024 / 1024).toFixed(2)}MB
                          </Badge>
                        </div>
                        <small className="text-muted-foreground">
                          {new Date(file.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full">Incorporar</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Código de incorporação</DialogTitle>
                              <DialogDescription>
                                Copie o código abaixo e cole entre as tags
                                &lt;body&gt;&lt;/body&gt; do seu site.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              rows={4}
                              readOnly
                              className="text-muted-foreground"
                            >{`<iframe src="http://localhost:3000/file_view/${file.id}" width="1280" height="720"></iframe>`}</Textarea>
                            <DialogFooter>
                              <Button
                                onClick={() =>
                                  handleCopy(
                                    `<iframe src="http://localhost:3000/file_view/${file.id}" width="1280" height="720"></iframe>`
                                  )
                                }
                              >
                                {copied ? <Check /> : <Clipboard />}
                                {copied ? "Copiado!" : "Copiar"}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Fechar</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Trash />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Tem certeza?</DialogTitle>
                              <DialogDescription>
                                Ao excluir, não será mais possível visualizar o
                                arquivo em nenhum site que esteja incorporado e
                                nem restaurá-lo no futuro.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                onClick={() => handleDeleteFile(file)}
                                variant="destructive"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Icons.spinner className="animate-spin" />
                                ) : (
                                  "Sim, tenho certeza"
                                )}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">Fechar</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {!search.trim() &&
                  serverFiles.length === 0 &&
                  !isLoading &&
                  uploadingFiles.length === 0 && (
                    <Card
                      className="aspect-video flex items-center justify-center cursor-pointer"
                      onClick={handleButtonClick}
                    >
                      <Plus />
                    </Card>
                  )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Storage />
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => ({ props: {} }));
