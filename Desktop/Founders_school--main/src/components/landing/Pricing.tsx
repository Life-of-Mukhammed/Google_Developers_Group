
"use client"

import { motion } from "framer-motion"
import { Check, ShieldCheck, Zap, Crown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "Oylik",
    description: "Boshlang'ich hamjamiyat a'zoligi",
    features: [
      "Asosiy networking",
      "Jamiyat forumi",
      "Haftalik yangiliklar"
    ],
    badge: "Boshlovchi",
    buttonText: "Hozir qo'shiling",
    icon: ShieldCheck,
    highlight: false,
  },
  {
    name: "Professional",
    price: "100,000",
    period: "Oylik",
    description: "To'liq kirish va networking",
    features: [
      "Barcha onlayn kurslar",
      "Jonli vebinarlar",
      "Yopiq chatlar",
      "Mentorlik sessiyalari"
    ],
    badge: "Eng ommabop",
    buttonText: "Obuna bo'ling",
    icon: Zap,
    highlight: true,
  },
  {
    name: "Investor",
    price: "1,000,000",
    period: "Yillik",
    description: "Eksklyuziv imkoniyatlar",
    features: [
      "Barcha Pro imkoniyatlar",
      "Demo Day kirish",
      "Investorlar bilan aloqa",
      "VIP tadbirlar"
    ],
    badge: "Eng yaxshi qiymat",
    buttonText: "Hozir boshlang",
    icon: Crown,
    highlight: false,
    discount: "20% tejash"
  }
]

export function Pricing() {
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.shakhbozbek.FoundersSchool"

  return (
    <section id="pricing" className="py-12 md:py-24 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="absolute top-1/4 left-1/4 w-32 md:w-96 h-32 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-32 md:w-96 h-32 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px] -z-10" />

      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 space-y-3 md:space-y-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase"
          >
            Oddiy va shaffof <br className="hidden md:block" />
            <span className="text-primary">Narxlarimiz</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium"
          >
            Sizga mos keladigan rejani tanlang
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className={cn(
                "relative rounded-3xl md:rounded-[2.5rem] p-5 md:p-10 flex flex-col justify-between transition-all duration-500",
                plan.highlight 
                  ? "bg-primary text-white shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] lg:scale-105 z-10" 
                  : "bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
              )}
            >
              <div className="flex justify-between items-start mb-4 md:mb-8">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border",
                  plan.highlight ? "bg-white/20 border-white/30 text-white" : "bg-primary/10 border-primary/20 text-primary"
                )}>
                  {plan.badge}
                </span>
                <plan.icon className={cn("w-4 h-4 md:w-6 md:h-6", plan.highlight ? "text-white" : "text-primary")} />
              </div>

              <div className="space-y-3 md:space-y-6 flex-grow">
                <div>
                  <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-4xl font-black">
                      {plan.price}
                    </span>
                    <span className="text-[9px] md:text-[10px] font-bold opacity-60 uppercase tracking-widest">UZS / {plan.period}</span>
                  </div>
                  {plan.discount && (
                    <p className="text-[9px] md:text-[10px] font-bold text-green-500 dark:text-green-400 mt-1 uppercase tracking-widest">{plan.discount}</p>
                  )}
                </div>

                <div className="space-y-2.5 md:space-y-4 pt-3 md:pt-4 border-t border-current/10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Check className={cn("w-3 h-3 md:w-4 md:h-4 shrink-0", plan.highlight ? "text-white" : "text-primary")} />
                      <span className="text-[13px] md:text-sm font-medium opacity-80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                asChild
                size="lg" 
                className={cn(
                  "mt-6 md:mt-10 h-11 md:h-14 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest group shadow-xl w-full",
                  plan.highlight 
                    ? "bg-white text-primary hover:bg-white/90" 
                    : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Link href={playStoreLink} target="_blank" rel="noopener noreferrer">
                  {plan.buttonText}
                  <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
