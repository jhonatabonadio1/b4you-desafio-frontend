 
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppSidebar } from "@/components/app-sidebar";
import { ModeSwitcher } from "@/components/mode-switcher";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { z } from "zod";

import { withSSRAuth } from "@/utils/withSSRAuth";
import Head from "next/head";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { DocumentsCombobox } from "@/components/documents-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import NumbersWithBadges from "@/components/analytics/numbers-with-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContext, useEffect, useRef, useState } from "react";
import { api } from "@/services/apiClient";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFiles } from "@/services/hooks/files";
import { Badge } from "@/components/ui/badge";
import { RadioTower, User } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "@/contexts/AuthContext";

const FormSchema = z.object({
  docId: z.string(),
  calendar: z.object({
    from: z.date(),
    to: z.date(),
  }),
  datePicker: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

interface TrackingNumbersProps {
  totalViews: number;
  totalInteractionTime: number;
  averageTimePerPage: number;
  sessions: number;
}

interface Pages {
  pageNumber: number;
  views: number;
  averageTime: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
}

export default function Analytics() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingNumbers, setTrackingNumbers] =
    useState<TrackingNumbersProps | null>(null);
    
  const {user, } = useContext(AuthContext)

  const [pages, setPages] = useState<Pages[] | null>(null);

  const { data, isLoading: loadingDocs } = useFiles();

  const [documentsPickerData, setDocumentsPickerData] = useState<
    { label: string; value: string }[]
  >([] as { label: string; value: string }[]);

  useEffect(() => {
    if (data && data.length > 0) {
      for (const file of data) {
        const pickerData = {
          label: file.title,
          value: file.id,
        };
        setDocumentsPickerData((prev) => [...prev, pickerData]);
      }
    }
  }, [data]);


  const socketRef = useRef<Socket | null>(null); // Ref para armazenar a conexão WebSocket
  
  function liveViewInitializer(docId: string) {
    if (!socketRef.current) {
      socketRef.current = io("https://incorporae-f47969ed39cb.herokuapp.com", {
        transports: ["websocket"],
      });
  
      socketRef.current.on("connect", () => {
        console.log("✅ WebSocket conectado!", socketRef.current?.id);
  
        // O Analytics (dono) entra na "docOwner:docId"
        socketRef.current?.emit("joinDocumentOwnerRoom", {
          documentId: docId,
          token: api.defaults.headers.Authorization,
        });
      });
  
      socketRef.current.on("disconnect", () => {
        console.log("❌ WebSocket desconectado.");
      });
  
      // Agora escuta atualizações
      socketRef.current.on("activeUsersCount", (data) => {
        // data = { documentId, count }
        setActiveUsers(() => {
          console.log(`🔄 Atualizando usuários ativos: ${data.count}`);
          return data.count;
        });
      });
    } else {
      // Se já existia
      socketRef.current.emit("joinDocumentOwnerRoom", {
        documentId: docId,
        token: api.defaults.headers.Authorization,
      });
    }
  }
  
  

  async function fetchPdf(
    docId: string,
    datas: { dataInicio: string; dataFim: string }
  ) {
    if (!docId) return;
    try {
      const { data } = await api.get(
        `/file/${docId}?dataInicio=${datas.dataInicio}&dataFim=${datas.dataFim}`
      );
      setPdfUrl(data.url);

      liveViewInitializer(docId);
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchDocTrackingNumbers(
    docId: string,
    datas: { dataInicio: string; dataFim: string }
  ) {
    try {
      const { data } = await api.get(
        `/tracking/${docId}?dataInicio=${datas.dataInicio}&dataFim=${datas.dataFim}`
      );
      setTrackingNumbers(data);
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTrackingPages(
    docId: string,
    datas: { dataInicio: string; dataFim: string }
  ) {
    try {
      const { data } = await api.get(
        `/tracking/${docId}/pages?dataInicio=${datas.dataInicio}&dataFim=${datas.dataFim}`
      );
      setPages(data);
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      calendar: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
      datePicker: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const { docId } = data;

    const datas = {
      dataInicio: data.calendar.from.toISOString(),
      dataFim: data.calendar.to.toISOString(),
    };

    fetchPdf(docId, datas);
    fetchDocTrackingNumbers(docId, datas);
    fetchTrackingPages(docId, datas);
  };

  const [activeUsers, setActiveUsers] = useState(0);

  return (
    <>
      <Head>
        <title>Análises - Incorporae!</title>
      </Head>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-gradient-to-tr from-primary-foreground via-background to-background">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex flex-row items-center w-full justify-between px-4 gap-4">
              <div className="flex items-center gap-2 ">
                <SidebarTrigger className="-mx-1" />
                <div className="hidden self-center items-center gap-1 md:flex">
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className=" md:block">
                        <BreadcrumbLink href="#">Análises</BreadcrumbLink>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              <div className="flex  flex-1 items-center justify-end gap-2">
                <div className="w-auto">
                  <ModeSwitcher />
                </div>
              </div>
            </div>
          </header>
          <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
            <header className="flex flex-col lg:flex-row lg:items-center gap-4 w-full justify-between border-b py-4">
              <div>
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                  Análises
                </h2>
                <p className="text-muted-foreground">
                  Confira insights dos seus documentos
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-4 relative h-full w-full">
              <div className="flex flex-row items-center gap-4 justify-between">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col lg:flex-row items-end gap-4 w-full lg:w-auto self-start"
                  >
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                      <FormField
                        control={form.control}
                        name="calendar"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-md font-normal">
                              Documento
                            </FormLabel>
                            <FormControl className="w-full">
                              {!loadingDocs && (
                                <DocumentsCombobox
                                  data={documentsPickerData}
                                  value={form.watch("docId")}
                                  onChange={(docId) =>
                                    form.setValue("docId", docId)
                                  }
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                      <FormField
                        control={form.control}
                        name="calendar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md font-normal">
                              Período
                            </FormLabel>
                            <FormControl className="w-full">
                              <CalendarDatePicker
                                date={field.value}
                                onDateSelect={({ from, to }) => {
                                  form.setValue("calendar", { from, to });
                                }}
                                variant="outline"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      variant="default"
                      type="submit"
                      className="w-full lg:w-auto"
                      disabled={!form.watch("docId")}
                    >
                      Analisar
                    </Button>
                  </form>
                </Form>

                {pdfUrl && (
                  <div className="p-4 border border-red-600 flex rounded-lg flex-col gap-2">
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-600 self-center"
                    >
                      <RadioTower className="mr-1 h-3 w-3" /> Ao vivo
                    </Badge>
                    <div className="flex flex-row items-center gap-0">
                      <h3 className="text-xl font-semibold">{activeUsers} </h3>
                      <User className=" h-5 w-5" />
                    </div>
                  </div>
                )}
              </div>

              {trackingNumbers && <NumbersWithBadges data={trackingNumbers} />}

              {pdfUrl && !loadingDocs && (
                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 flex-1">
                  {/* Card */}
                  <Card>
                    <CardContent className="pt-6 h-full">
                      <div className="overflow-hidden rounded-lg h-full">
                        {pdfUrl && (
                          <object
                            data={pdfUrl ?? ""}
                            type="application/pdf"
                            className=" h-full w-full"
                          >
                            <p>
                              Seu navegador não suporta visualização de PDFs.
                            </p>
                          </object>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados coletados</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[500px] overflow-y-auto">
                      {pages && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[100px]">
                                Página
                              </TableHead>
                              <TableHead>Visualizações</TableHead>
                              <TableHead>Tempo médio.</TableHead>
                              <TableHead>Tempo total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pages.map((item) => (
                              <TableRow key={item.pageNumber}>
                                <TableCell className="font-medium">
                                  {item.pageNumber}
                                </TableCell>
                                <TableCell>{item.views}</TableCell>

                                <TableCell>
                                  {item.averageTime < 60
                                    ? item.averageTime + "s"
                                    : item.averageTime + " min"}
                                </TableCell>
                                <TableCell>
                                  {item.totalTime < 60
                                    ? item.totalTime + "s"
                                    : item.totalTime + " min"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
