"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"


import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
       <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-10 w-10" />
        <span className="hidden font-bold lg:inline-block text-lg">Incorporaê!</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm xl:gap-6">
        <Link
          href="/#planos"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/#planos" ? "text-foreground" : "text-foreground/80"
          )}
        >
          Planos
        </Link>
       
      </nav>
    </div>
  )
}