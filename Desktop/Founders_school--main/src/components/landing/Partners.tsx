
"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const sponsors = [
  {
    name: "STARTUP GARAGE",
    logo: (
      <div className="flex items-center gap-5">
        <div ><svg
          width="20"
          height="20"
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
        </svg></div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-bold text-slate-900 tracking-tighter">STARTUP</span>
          <span className="text-[14px] font-black text-slate-900 tracking-tighter">GARAGE</span>
        </div>
      </div>
    ),
  },
  {
    name: "AloqaBank",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#289ec8] rounded-sm relative">
          <div ><svg
            width="20"
            height="20"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
           
            <rect x="0" y="0" width="200" height="200" fill="#289ec8" />

        
            <path
              d="M20 70 L100 30 L180 70 L170 90 L100 50 L30 90 Z"
              fill="#fff"
            />
          </svg></div>
        </div>
        <span className="text-lg font-bold text-slate-900">Aloqa<span className="text-[#00AEEF]">Bank</span></span>
      </div>
    ),
  },
  {
    name: "AloqaVentures",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#5458FF] rounded-sm relative">
          <div ><svg
            width="20"
            height="20"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
           
            <rect x="0" y="0" width="200" height="200" fill="#289ec8" />

        
            <path
              d="M20 70 L100 30 L180 70 L170 90 L100 50 L30 90 Z"
              fill="#fff"
            />
          </svg></div>
        </div>
        <span className="text-lg font-bold text-slate-900">Aloqa<span className="text-[#00AEEF]">Ventures</span></span>
      </div>
    ),
  },
]

const partners = [
  {
    name: "pivot",
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">P</div>
        <span className="text-xl font-bold text-slate-900 lowercase tracking-tighter">pivot</span>
      </div>
    ),
  },
  {
    name: "QIZLAR AKADEMIYASI",
    logo: (
      <div className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 417 456"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M416.47 318.044V455.22H0V314.476L64.4906 330.43V390.684H351.934V368.489L191.091 328.762L153.415 319.381L24.4788 287.564L0 281.517V215.119L39.9592 224.981L153.415 253.035L202.47 265.135L416.47 318.051V318.044Z"
            fill="#ec4545"
          />
          <path
            d="M416.47 104.863V0.360352H0V181.634L416.47 284.612V137.822L355.172 122.679L303.014 109.775L302.684 109.73V169.601L347.6 180.695L351.934 181.747V202.177L64.4906 131.152V64.851H351.934V88.9016L416.47 104.855V104.863Z"
            fill="#ec4545"
          />
        </svg>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[9px] font-bold text-slate-900">SG</span>
          <span className="text-[11px] font-black text-slate-900">Women</span>
        </div>
      </div>
    ),
  },
]

export function Partners() {
  return (
    <section id="partners" className="py-24 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 text-center space-y-20">
        {/* Homiylyar */}
        <div className="space-y-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
          >
            Homiylyar
          </motion.h3>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {sponsors.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white px-8 py-5 rounded-2xl shadow-xl flex items-center justify-center min-w-[200px]"
              >
                {s.logo}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hamkorlar */}
        <div className="space-y-10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"
          >
            Hamkorlar
          </motion.h3>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {partners.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white px-8 py-5 rounded-2xl shadow-xl flex items-center justify-center min-w-[200px]"
              >
                {p.logo}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
