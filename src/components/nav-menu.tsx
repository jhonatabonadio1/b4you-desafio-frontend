import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/router";

export function NavMenu({
  menu,
}: {
  menu: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const route = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Visão geral</SidebarGroupLabel>
      <SidebarMenu>
        {menu.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={route.pathname === item.url}>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
