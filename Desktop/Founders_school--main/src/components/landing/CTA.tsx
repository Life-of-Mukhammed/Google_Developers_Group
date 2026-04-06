
"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

const AppleLogo = () => (
  <svg viewBox="0 0 384 512" className="w-6 h-6 md:w-7 md:h-7 mr-3 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.1-42.9.6-82.7 25.1-104.7 63.3-45.5 78.8-11.7 195.8 32.5 259.2 21.6 31 46.5 65.5 79.9 64.3 31.8-1.2 44.1-20.4 82.6-20.4 37.8 0 49.3 20.4 82.6 19.7 34.6-.7 56.4-31.1 77.9-62.4 24.7-35.9 34.9-70.7 35.2-72.5-.7-.3-67.2-25.9-67.4-102.5zM245.7 82.1c21.8-26.2 36.4-62.7 32.4-98.8-31.1 1.3-68.7 20.8-91 46.8-19.9 23.1-37.3 60.1-32.6 95.4 34.4 2.6 69.4-17.1 91.2-43.4z" />
  </svg>
)

const GooglePlayLogo = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 md:w-7 md:h-7 mr-3 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-10.3 18-28.5-1.2-40.8zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
  </svg>
)

export function CTA() {
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.shakhbozbek.FoundersSchool"

  return (
    <section id="final-cta" className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary rounded-[2rem] md:rounded-[3.5rem] p-10 md:p-24 text-center space-y-10 md:space-y-14 relative overflow-hidden shadow-[0_30px_60px_rgba(59,130,246,0.4)]"
        >
          {/* Dekorativ elementlar */}
          <div className="absolute top-0 right-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-white/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 md:w-[500px] h-64 md:h-[500px] bg-black/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6 md:space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                Ilovani hozir yuklab oling
              </h2>
              <p className="text-white/90 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-semibold">
                Muvaffaqiyatli startup sari birinchi qadamni qo'ying. <br className="hidden md:block" /> Jamiyatimiz sizni kutmoqda.
              </p>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-8">
              <Button asChild size="lg" className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 bg-white text-slate-950 hover:bg-slate-50 font-black text-xl md:text-2xl rounded-2xl md:rounded-[2rem] shadow-2xl transition-all transform hover:scale-105 active:scale-95 group">
                <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
                  <AppleLogo />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">Yuklab oling</span>
                    <span>App Store</span>
                  </div>
                </Link>
              </Button>
              
              <Button asChild size="lg" className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-12 bg-slate-950 text-white hover:bg-slate-900 font-black text-xl md:text-2xl rounded-2xl md:rounded-[2rem] shadow-2xl transition-all transform hover:scale-105 active:scale-95 group border border-white/10">
                <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
                  <GooglePlayLogo />
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">Yuklab oling</span>
                    <span>Google Play</span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
