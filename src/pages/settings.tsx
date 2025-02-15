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
import Head from "next/head";
import { AccountForm } from "../components/settings/account-form";
import { SidebarNav } from "@/components/sidebar-nav";
import { useState } from "react";
import { withSSRAuth } from "@/utils/withSSRAuth";

const sidebarNavItems = [
  {
    title: "Conta",
    value: "account",
  },
];

export default function Settings() {

  const [currentNav, setCurrentNav] = useState("account")

  return (
    <>
      <Head>
        <title>Configurações - Incorporae!</title>
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
                        <BreadcrumbLink href="#">Configurações</BreadcrumbLink>
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
                  Configurações
                </h2>
                <p className="text-muted-foreground">
                  Gerencie suas preferências e planos de assinatura.
                </p>
              </div>
            </header>

            <div className="relative h-full w-full">
              <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                  <SidebarNav items={sidebarNavItems} current={currentNav} onChangeNav={setCurrentNav} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                  {
                    currentNav === "account" && <AccountForm />
                  }
                 
                </div>
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
