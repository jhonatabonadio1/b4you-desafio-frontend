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
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { api } from "@/services/apiClient";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FormSchema = z.object({
  calendar: z.object({
    from: z.date(),
    to: z.date(),
  }),
  datePicker: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export default function Analytics() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const docId = "67b37b42737e02cad3feb6d8";
  
  useEffect(() => {
    setIsLoading(true);
    async function fetchPdf() {
      if (!docId) return;
      try {
        const { data } = await api.get(`/file/${docId}`);
        setPdfUrl(data.url);
      } catch (error) {
        console.error("Erro ao buscar documento:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPdf();
  }, [docId]);

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
    console.log("oi");
  };

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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-row items-end gap-4 self-start"
                >
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="calendar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md font-normal">
                            Documento
                          </FormLabel>
                          <FormControl className="w-full">
                            <DocumentsCombobox data={frameworks} onChange={() => {}}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
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
                  <Button variant="default" type="submit" className="w-full">
                    Analisar
                  </Button>
                </form>
              </Form>

              <NumbersWithBadges />

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
                          <p>Seu navegador não suporta visualização de PDFs.</p>
                        </object>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Página</TableHead>
                          <TableHead>Visualizações</TableHead>
                          <TableHead>Tempo médio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">1</TableCell>
                          <TableCell>23</TableCell>
                          <TableCell>12 segundos</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
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
