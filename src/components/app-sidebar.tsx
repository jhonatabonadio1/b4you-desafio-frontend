import * as React from "react"
import {
  FileText,
  GalleryVerticalEnd,
  Rocket,
  
  ChartColumnDecreasing,
  Settings
} from "lucide-react"

import { NavMenu } from "@/components/nav-menu"
import { NavUser } from "@/components/nav-user"
import { ProjectSwitcher } from "@/components/project-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Jhonata Bonadio",
    email: "jhonbonadio@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "INITECH INFORMÁTICA LTDA",
      logo: GalleryVerticalEnd,
      plan: "Business",
    },
  ],
  menu: [
    {
      name: "Meus PDFs",
      url: "#",
      icon: FileText,
    },
    {
      name: "Métricas",
      url: "#",
      icon: ChartColumnDecreasing,
    },
    {
      name: "Integrações",
      url: "#",
      icon: Rocket,
    },
    {
      name: "Configuraçoes",
      url: "#",
      icon: Settings,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu menu={data.menu} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
