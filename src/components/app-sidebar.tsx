import React, { useEffect } from "react";
import { Rocket } from "lucide-react";

import { NavMenu } from "@/components/nav-menu";
import { NavUser } from "@/components/nav-user";
import Intercom from "@intercom/messenger-js-sdk";

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

const data = {
  menu: [
    {
      name: "Minhas Campanhas",
      url: "/",
      icon: Rocket,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  useEffect(() => {
    Intercom({
      app_id: "qur8i35e",
    });
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className={`${state === "expanded" && "p-2"}`}>
          <Link href="/" className="flex items-center ">
            {state === "expanded" ? (
              <Icons.logoFull className="w-20 h-auto" />
            ) : (
              <Icons.logo className="h-8 w-8 p-1" />
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
