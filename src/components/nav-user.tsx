/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
Settings,
  ChevronsUpDown,
  CreditCard,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useRouter } from "next/router"
import { useContext, useState } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/apiClient"
import { toast } from "@/hooks/use-toast"
import { Icons } from "./icons"

export function NavUser() {
  const { isMobile } = useSidebar()
  const route = useRouter();

  const {user} = useContext(AuthContext)

  const {signOut} = useContext(AuthContext)

  const fullName = user.firstName + " " + user.lastName
  const fallBack = user.firstName?.substring(0, 1) + user.lastName?.substring(0, 1)

  const [isLoading, setIsLoading] = useState(false)

  async function subscriptionPortal(e: any){
    e.preventDefault()
    setIsLoading(true)
    try{
      const response = await api.get("/stripe/portal")
      console.log(response.data)
      return route.push(response.data)
    }catch{
      toast({
        title: "Ocorreu um problema",
        description: "Não foi possível abrir o portal de assinaturas.",
        variant:  "destructive"
      })
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage alt={fullName} />
                <AvatarFallback className="rounded-full">{fallBack}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 relative rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
           {
            isLoading &&  <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full rounded-lg bg-background/70">
            <Icons.spinner className="animate-spin" />
          </div>
           }
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={fullName} />
                  <AvatarFallback className="rounded-full">{fallBack}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{fullName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => route.push("/settings")}>
                <Settings />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={subscriptionPortal}>
                <CreditCard />
                Gerenciar assinatura
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
