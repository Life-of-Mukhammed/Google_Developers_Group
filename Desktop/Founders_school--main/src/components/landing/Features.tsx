
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Onlayn kurslar va amaliy qo‘llanmalar",
    description: "Startup Garage mutaxassislari tomonidan tayyorlangan real tajribaga asoslangan kurslar va qo‘llanmalar. Har bir dars – asoschining amalda o‘z biznesini boshlashi uchun zarur vosita.",
    imageId: "feature-courses",
    textLeft: true,
  },
  {
    title: "Vebinarlar va jonli ekspert sessiyalari",
    description: "Har hafta tajribali tadbirkorlar, investorlar va mentorlar bilan jonli muloqotlar. Savol-javoblar, insaytlar va eksklyuziv bilimlar faqat hamjamiyat a’zolari uchun.",
    imageId: "feature-webinars",
    textLeft: false,
  },
  {
    title: "A’zolar suhbati va hamkasblar bilan muhokamalar",
    description: "O‘xshash yo‘ldan ketayotgan asoschilar bilan yopiq guruhlar va forumlarda muloqot. Fikr almashish, muammolarga yechim topish va bir-biringizni ilhomlantirish imkoniyati.",
    imageId: "feature-chat",
    textLeft: true,
  },
  {
    title: "Shaxsiy va professional rivojlanish",
    description: "Startup asoschisi sifatida o‘sishingiz uchun liderlik, vaqtni boshqarish, muomala va moliyaviy savodxonlik kabi ko‘nikmalarni mustahkamlovchi resurslar.",
    imageId: "feature-growth",
    textLeft: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase px-4"
          >
            Founders School hamjamiyatida <br className="hidden md:block" />
            <span className="text-primary">nimalar bor?</span>
          </motion.h2>
          <div className="w-16 md:w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="space-y-24 md:space-y-40">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={cn(
                "flex flex-col gap-10 md:gap-12 items-center",
                feature.textLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              )}
            >
              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left"
              >
                <h3 className="text-xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-base md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {feature.description}
                </p>
              </motion.div>

              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 relative group w-full flex justify-center"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] md:blur-[80px] group-hover:bg-primary/30 transition-colors duration-500" />
                
                {/* Mockup Container */}
                <div className="relative w-[240px] h-[480px] md:w-[320px] md:h-[650px] bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-slate-200 dark:border-slate-800 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] overflow-hidden z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-4 md:h-6 bg-slate-200 dark:bg-slate-800 rounded-b-2xl z-20" />
                  {PlaceHolderImages.find(img => img.id === feature.imageId) && (
                    <Image 
                      src={PlaceHolderImages.find(img => img.id === feature.imageId)!.imageUrl}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
