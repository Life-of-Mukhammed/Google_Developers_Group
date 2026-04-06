
import Link from "next/link"
import { Rocket, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-slate-200 dark:border-white/5 pt-12 md:pt-20 pb-8 md:pb-10 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12 md:mb-16">
          <div className="max-w-xs space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="  rounded-lg shadow-lg shadow-primary/20">
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
                <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Founders School</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">Startup Garage</span>
              </div>
            </Link>
            <p className="text-slate-600 dark:text-muted-foreground text-sm leading-relaxed">
              O'zbekistonning eng kuchli startup asoschilari hamjamiyati. Kelajakni birga quramiz.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-slate-500 hover:text-primary transition-colors p-2 bg-slate-100 dark:bg-white/5 rounded-full"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-slate-500 hover:text-primary transition-colors p-2 bg-slate-100 dark:bg-white/5 rounded-full"><Linkedin className="w-5 h-5" /></Link>
              <Link href="#" className="text-slate-500 hover:text-primary transition-colors p-2 bg-slate-100 dark:bg-white/5 rounded-full"><Instagram className="w-5 h-5" /></Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 w-full lg:w-auto">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">Resurslar</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Yordam markazi</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Qo'llanmalar</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Hamkorlik</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest">Hujjatlar</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Maxfiylik siyosati</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Foydalanish shartlari</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-slate-500 dark:text-muted-foreground text-center md:text-left">
          <div className="space-y-2">
            <p>© 2024 Founders School. Barcha huquqlar himoyalangan.</p>
            <p className="flex items-center justify-center md:justify-start gap-1.5 font-medium">
              O'zbekiston bo'ylab 2000+ faol asoschilar bilan birga.
            </p>
          </div>

          <Link
            href="https://www.instagram.com/life_of_mukhammed"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full transition-all hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
          >
            <span className="font-bold tracking-tight">Created by Mukhammadzokhid Mukhtarzhanov</span>
            <div className="bg-primary/10 p-1 rounded-full group-hover:bg-primary transition-colors">
              <Instagram className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
