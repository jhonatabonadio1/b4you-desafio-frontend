import React, {useEffect} from "react";
import {
  ChartColumn,
  FileText,
  Flame,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMenu } from "@/components/nav-menu";
import { NavUser } from "@/components/nav-user";
import Intercom from '@intercom/messenger-js-sdk';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Icons } from "./icons";

// This is sample data.
const data = {
  projects: [
    {
      name: "INITECH INFORMÁTICA LTDA",
      logo: GalleryVerticalEnd,
      plan: "Business",
    },
  ],
  menu: [
    {
      name: "Meus Documentos",
      url: "/documents",
      icon: FileText,
    },
    {
      name: "Mapas de calor",
      url: "/heatmaps",
      icon: Flame,
    },
    {
      name: "Análises",
      url: "/analytics",
      icon: ChartColumn,
    },
  ],
};  


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  useEffect(() => {
    Intercom({
      app_id: 'qur8i35e',
    });
  }, [])
  

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`${state === "expanded" && "p-2"}`}>
          <Link href="/" className="flex items-center gap-2">
           
            {state === "expanded" ? (
             <Icons.logoFull className="w-28" />
            ) : (
              <Icons.logo className="h-8 w-8" />
            )}
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMenu menu={data.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
