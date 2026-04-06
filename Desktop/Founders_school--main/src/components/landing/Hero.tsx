
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Rocket, Star, Users } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export function Hero() {
  const [isMounted, setIsMounted] = useState(false)
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.shakhbozbek.FoundersSchool"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const appImage = PlaceHolderImages.find(img => img.id === "app-mockup")

  if (!isMounted) return <div className="h-screen bg-hero-gradient" />

  return (
    <section className="relative min-h-screen pt-24 pb-12 md:pt-40 md:pb-32 overflow-hidden bg-hero-gradient flex items-center justify-center">
      {/* Background Large Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[15vw] font-black text-primary/5 tracking-tighter uppercase leading-none opacity-50 dark:opacity-20">
          FOUNDERS
        </h1>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        {/* Floating Header Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl mb-8 md:mb-12"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            Hozirda: 300+ faol foydalanuvchilar
          </span>
        </motion.div>
        
        <div className="text-center max-w-4xl space-y-6 md:space-y-8 mb-12 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white"
          >
            G'oyangizni real <br />
            <span className="text-primary">startupga</span> aylantiring
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto px-4"
          >
            O‘zbekistonning eng kuchli asoschilari jamiyati endi sizning smartfoningizda. maqolalar, online kurslar va masterklaslar.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="rounded-full px-8 h-12 md:h-14 bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl">
              <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
                Hozir qo'shiling →
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Central Mockup Container */}
        <div className="relative w-full max-w-[900px] flex justify-center mt-8 md:mt-12 px-4">
          
          {/* Floating Stats Left - Hidden on mobile */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute left-0 top-1/4 hidden lg:flex flex-col items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl border border-white/20 z-20"
          >
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 dark:text-white">140+</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Muvaffaqiyat</p>
            </div>
          </motion.div>

          {/* Floating User Right - Hidden on mobile */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute right-0 top-1/3 hidden lg:flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-white/20 z-20"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden relative">
                  <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="user" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-900 dark:text-white">300+ Users</p>
              <p className="text-[9px] text-primary font-black uppercase">Waiting List</p>
            </div>
          </motion.div>

          {/* Main Mockup - Responsive scaling */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-[260px] h-[520px] sm:w-[300px] sm:h-[600px] md:w-[320px] md:h-[650px] bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[10px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden z-10"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-slate-800 rounded-b-2xl z-20" />
            {appImage && (
              <Image 
                src={appImage.imageUrl}
                alt="App Mockup"
                fill
                className="object-cover"
                priority
              />
            )}
          </motion.div>

          {/* Section Divider (Curve) - Desktop only */}
          <div className="absolute bottom-[-100px] left-[-50vw] right-[-50vw] h-[400px] bg-white dark:bg-slate-950 rounded-[100%] z-0 hidden md:block" />
        </div>
      </div>
    </section>
  )
}
