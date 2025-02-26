"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Icons } from "./icons";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mr-4 flex md:hidden">
        <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
          <Icons.logo className="h-10 w-10" />
       
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
    </>
  );
}
