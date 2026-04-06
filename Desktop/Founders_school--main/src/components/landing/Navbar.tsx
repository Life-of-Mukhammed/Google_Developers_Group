
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Moon, Sun, ArrowRight, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/ThemeProvider"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.shakhbozbek.FoundersSchool"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[94%] md:w-[90%] max-w-6xl rounded-full px-4 md:px-8 py-2 md:py-3",
        isScrolled
          ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="">
            <svg
              width="30"
              height="30"
              viewBox="0 0 417 456"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M416.47 318.044V455.22H0V314.476L64.4906 330.43V390.684H351.934V368.489L191.091 328.762L153.415 319.381L24.4788 287.564L0 281.517V215.119L39.9592 224.981L153.415 253.035L202.47 265.135L416.47 318.051V318.044Z"
                fill="#5458FF"
              />
              <path
                d="M416.47 104.863V0.360352H0V181.634L416.47 284.612V137.822L355.172 122.679L303.014 109.775L302.684 109.73V169.601L347.6 180.695L351.934 181.747V202.177L64.4906 131.152V64.851H351.934V88.9016L416.47 104.855V104.863Z"
                fill="#5458FF"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base md:text-xl tracking-tight text-slate-900 dark:text-white">Founders School</span>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] mt-0.5">Startup Garage</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
          <Link href="#" className="hover:text-primary transition-colors">Bosh sahifa</Link>
          <Link href="#features" className="hover:text-primary transition-colors">Ilova</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Narxlar</Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9 md:w-10 md:h-10 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>

          <Button asChild className="hidden sm:flex bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-6 md:px-8 h-10 md:h-12 shadow-xl shadow-primary/20 group">
            <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
              Download
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10">
                <div className="flex flex-col gap-8 mt-12 text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  <Link href="#" className="hover:text-primary transition-colors">Bosh sahifa</Link>
                  <Link href="#features" className="hover:text-primary transition-colors">Ilova</Link>
                  <Link href="#pricing" className="hover:text-primary transition-colors">Narxlar</Link>
                  <Link href="#testimonials" className="hover:text-primary transition-colors">FAQ</Link>
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full h-12">
                    <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
                      Download
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
