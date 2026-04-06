"use client"

import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function ValueProp() {
  const features = [
    {
      title: "HOW DETERRENCE WORKS: A STEP-BY-STEP GUIDE",
      image: PlaceHolderImages.find(img => img.id === "abstract-1"),
      colSpan: "md:col-span-2",
      badge: "UX",
      dark: true
    },
    {
      title: "SUBSCRIBE",
      description: "Select the level of protection that best suits your home. Flexible tiers ensure you only pay for what you need.",
      colSpan: "md:col-span-1",
      badge: "01",
      dark: false,
      hasButton: true
    },
    {
      title: "NIGHTLY PATROLS",
      description: "A MARKED VEHICLE PASSES YOUR HOME",
      colSpan: "md:col-span-1",
      badge: "SAFE GUARD",
      dark: true,
      image: PlaceHolderImages.find(img => img.id === "abstract-2")
    },
    {
      title: "GET UPDATES",
      description: "Receive instant SMS alerts with the patrol's estimated arrival time.",
      colSpan: "md:col-span-2",
      badge: "03",
      dark: true,
      image: PlaceHolderImages.find(img => img.id === "app-mockup")
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-950 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2.5rem] overflow-hidden group h-[400px] ${f.colSpan} ${f.dark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}
            >
              {f.image && (
                <div className="absolute inset-0 opacity-50 group-hover:scale-110 transition-transform duration-700">
                  <Image src={f.image.imageUrl} alt={f.title} fill className="object-cover" />
                </div>
              )}
              
              <div className="relative h-full p-10 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${f.dark ? 'border-white/20' : 'border-slate-300'}`}>
                    {f.badge}
                  </span>
                  {f.hasButton && (
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                      <ArrowUpRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter leading-none uppercase">
                    {f.title}
                  </h3>
                  {f.description && (
                    <p className={`text-sm font-medium ${f.dark ? 'text-white/60' : 'text-slate-500'} max-w-[80%]`}>
                      {f.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}