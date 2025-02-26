import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Button } from "./ui/button"
import { useRouter } from "next/router"


export function SiteHeader() {
  const route = useRouter();

  
  return (
    <header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wrapper">
        <div className="container flex h-14 justiyitems-center">
          
          <MainNav />
          <MobileNav />
          <div className="flex flex-1 items-center justify-end gap-2 md:justify-end">
           
            <nav className="flex items-center gap-2">
              <Button
                 onClick={() => route.push("/signup")}
              >
                Cadastre-se
              </Button>
              <Button
                variant="outline"
                onClick={() => route.push("/login")}
                >
                  Login
                </Button>
              <ModeSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}