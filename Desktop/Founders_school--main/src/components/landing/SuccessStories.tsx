"use client";

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "Founders Community ilovasi orqali jamoamizga kerakli investorni topdik. Networking bu yerda yuqori darajada.",
    name: "Javohir Elmurodov",
    role: "Nexa Tech asoschisi",
    imageId: "founder-1"
  },
  {
    quote: "Webinarlar va kurslar juda foydali. Har kuni yangi bilimlar olaman va biznesimda qo'llayman.",
    name: "Mohira G'aniyeva",
    role: "GreenFlow CEO",
    imageId: "founder-2"
  },
  {
    quote: "Boshqa tadbirkorlar bilan muloqot qilish imkoniyati loyihamizdagi xatolarni tezroq tuzatishga yordam berdi.",
    name: "Azamat Sobirov",
    role: "DeliveryUp CTO",
    imageId: "founder-3"
  }
]

export function SuccessStories() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase"
          >
            Foydalanuvchilar <span className="text-primary">fikri.</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Real natijalar, real tajribalar. Jamiyatimiz a'zolari erishgan yutuqlar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => {
            const avatar = PlaceHolderImages.find(img => img.id === t.imageId)
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8 space-y-6">
                    <Quote className="w-10 h-10 text-primary/10 mb-4" />
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic">"{t.quote}"</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                        {avatar && (
                          <Image 
                            src={avatar.imageUrl} 
                            alt={t.name}
                            fill
                            className="object-cover"
                            data-ai-hint={avatar.imageHint}
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}