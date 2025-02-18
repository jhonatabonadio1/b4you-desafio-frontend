import * as React from "react";
import {
  ChartColumn,
  FileText,
  Flame,
  GalleryVerticalEnd,
} from "lucide-react";

import { NavMenu } from "@/components/nav-menu";
import { NavUser } from "@/components/nav-user";

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`${state === "expanded" && "p-2"}`}>
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8" />
            {state === "expanded" && (
              <span className=" font-bold lg:inline-block text-lg">
                Incorporae!
              </span>
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
