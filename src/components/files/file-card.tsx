/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Icons } from "../icons";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CopyToClipboard from "react-copy-to-clipboard";
import { Check, Clipboard, FileCode2, FileWarning,  Trash } from "lucide-react";
import { useDeleteFile } from "@/services/hooks/files";
import { toast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

interface Props {
  file: {
    id?: string;
    title?: string;
    sizeInBytes?: number;
    iframe?: string;
    createdAt?: string;
    status: "loading" | "completed" | "failed";
  };
  onDelete: (name: string) => void;
}

export function UploadFileCard({ file, onDelete }: Props) {
  const deleteFile = useDeleteFile();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFile = async (doc: any) => {
    setIsDeleting(true);
    try {
      await deleteFile.mutateAsync(doc.id);
      onDelete(doc.id);
    } catch (error) {
      console.log("Erro ao deletar arquivo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShareLink = () => {
    toast({
      variant: "default",
      title: "Link copiado com sucesso",
    });
  };

  function formatDate(date: string) {
    const formattedDate = format(parseISO(date), "dd/MM/yyyy 'às' HH:mm");

    return formattedDate;
  }

  return (
    <Card
      className={`${
        file.status === "failed" && "border-red-600"
      } flex flex-col justify-between relative aspect-video `}
    >
      {file.status === "loading" ? (
        <div className="flex w-full h-full items-center justify-center absolute top-0 left-0">
          <Icons.spinner className="animate-spin" />
        </div>
      ) : file.status === "failed" ? (
        <CardHeader>
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-2">
              <span className="truncate max-w-full">{file.title}</span>
            </div>
            <span className="flex flex-row items-center gap-2 text-red-500 mt-2">
              <FileWarning /> Não foi possível realizar o upload
            </span>
          </div>
        </CardHeader>
      ) : (
        <>
          <CardHeader className="flex flex-col  w-full">
            <div className="flex flex-1 overflow-auto flex-row items-center justify-between gap-2">
              <div className="truncate flex-1 max-w-xs lg:max-w-md min-w-0l">
                {file.title}
              </div>

              <Badge>
                {file.sizeInBytes! / 1024 > 1000
                  ? (file.sizeInBytes! / 1024 / 1024).toFixed(2) + " GB"
                  : (file.sizeInBytes! / 1024).toFixed(2) + " MB"}
              </Badge>
            </div>

            <small className="text-muted-foreground">
              {formatDate(file.createdAt!)}
            </small>
          </CardHeader>

          <CardContent>
            {file.status === "completed" && (
              <div className="flex items-center justify-center gap-2">
                 <CopyToClipboard
                  text={`https://incorporae.com.br/doc/${file.id}`}
                  onCopy={handleShareLink}
                >
                  <Button className="w-full">
                    Compartilhar
                  </Button>
                </CopyToClipboard>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" ><FileCode2 /></Button>
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
                      className="text-muted-foreground"
                      readOnly
                    >{`<iframe src="https://incorporae.com.br/file_view/${file.id}" width="1280" height="720"></iframe>`}</Textarea>
                    <DialogFooter>
                      <CopyToClipboard
                        text={`<iframe src="https://incorporae.com.br/file_view/${file.id}" width="1280" height="720"></iframe>`}
                        onCopy={() => {
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 3000);
                        }}
                      >
                        <Button>
                          {copied ? <Check /> : <Clipboard />}
                          {copied ? "Copiado!" : "Copiar"}
                        </Button>
                      </CopyToClipboard>
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
                        Ao excluir, não será mais possível visualizar o arquivo
                        em nenhum site que esteja incorporado e nem restaurá-lo
                        no futuro.
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
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
}
