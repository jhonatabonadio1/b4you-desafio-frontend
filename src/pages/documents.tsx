 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { withSSRAuth } from "@/utils/withSSRAuth";
import { Plus, Upload } from "lucide-react";
import Head from "next/head";
import { useCallback, useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Icons } from "@/components/icons";
import { useFiles, useUploadFile } from "@/services/hooks/files";
import Storage from "@/components/storage";
import { toast } from "@/hooks/use-toast";
import { UploadFileCard } from "@/components/files/file-card";
import { api } from "@/services/apiClient";
import { queryClient } from "@/services/queryClient";

// Importando o toast para exibir mensagens (necessário instalar, por exemplo, react-hot-toast)

interface FileProps {
  id?: string;
  title: string;
  sizeInBytes?: number;
  iframe?: string;
  jobId: string;
  createdAt?: string;
  status: "loading" | "completed" | "error";
}

export default function Documents() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useFiles(search); // ARQUVIOS DO SERVIDOR
  const [uploadingFiles, setUploadingFiles] = useState<FileProps[]>([]); // ARQUIVOS LOCAL
  const [jobIds, setJobsIds] = useState([] as string[]); // JOBS IDS

  const uploadFile = useUploadFile();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log(acceptedFiles);
      const newUploadingFiles = [] as FileProps[];
      const newJobsIds = [] as string[]
      for (const file of acceptedFiles) {
        try {
          const { title, jobId, id } = await uploadFile.mutateAsync(file);

          newUploadingFiles.push({ id, jobId, title, status: "loading" });

          newJobsIds.push(jobId);
        } catch ({ response }: any) {
          setUploadingFiles((prev) =>
            prev.filter((f) => f.title !== file.name)
          );

          toast({
            variant: "destructive",
            title: "Opa! Algo deu errado.",
            description:
              response.data.error ?? "Ocorreu um problema com sua solicitação.",
          });
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }

      setJobsIds((prev) => [...prev, ...newJobsIds])
      setUploadingFiles(newUploadingFiles);
    },
    [uploadFile]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
  
    async function checkUploadFileStatus() {
      try {
        const { data } = await api.post("/files/status", { jobIds });
  
        const updatedUploadingFiles = uploadingFiles.map((file) => {
          const foundItem = data.find((item: any) => item.id === file.jobId);
          if (foundItem) {
            if (foundItem.state === "completed") {
              return { ...foundItem.result, status: "completed" };
            }
          }
          return file;
        });
  
        const completedJobs = data
          .filter((item: any) => item.state === "completed")
          .map((item: any) => item.id);
  
        setUploadingFiles(updatedUploadingFiles);
        setJobsIds((prev) => prev.filter((jobId) => !completedJobs.includes(jobId)));
  
        queryClient.invalidateQueries("storage");
      } catch (error) {
        console.log(error);
      }
    }
  
    if (jobIds.length >= 1) {
      interval = setInterval(() => {
        checkUploadFileStatus();
      }, 5000);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [jobIds, uploadingFiles]);
  

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

  function onDeleteFile(id: string) {
    setUploadingFiles((prev) => prev.filter((item) => item.id !== id));
  }
  
  const filteredItems = () => {
    if (!isLoading && data) {
      return data.filter(
        (item: any) => !uploadingFiles.some((upload) => upload.id === item.id)
      );
    }
    return [];
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
            <header className="flex flex-col lg:flex-row lg:items-center gap-4 w-full justify-between border-b py-4">
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
                {uploadingFiles.map((file: FileProps) => (
                  <UploadFileCard
                    key={file.id}
                    file={file}
                    onDelete={onDeleteFile}
                  />
                ))}

                {!isLoading &&
                  filteredItems().map((file: FileProps) => (
                    <UploadFileCard
                      key={file.id}
                      file={file}
                      onDelete={onDeleteFile}
                    />
                  ))}

                {!search.trim() &&
                  !isLoading &&
                  uploadingFiles.length === 0 &&
                  filteredItems().length === 0 && (
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
