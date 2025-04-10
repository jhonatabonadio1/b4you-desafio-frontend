"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
        <Icons.logo className="h-8 w-8" />
      
      </Link>
      {pathname === "/" && (
        <nav className="flex items-center gap-4 text-sm xl:gap-6">
          <Link
            href="/#planos"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname.includes("/#planos")
                ? "text-foreground"
                : "text-foreground/80"
            )}
          >
            Planos
          </Link>
        </nav>
      )}
    </div>
  );
}
