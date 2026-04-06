"use client"

import { motion } from "framer-motion"

const features = [
  "Fast Response", "Visible Patrols", "24/7 Support", "Family Safe", "Low Cost", 
  "Strong Deterrence", "Expert Founders", "Real-Time Updates", "Investments", 
  "Networking", "Education", "Success Stories", "Mentorship"
]

export function FeatureTicker() {
  return (
    <div className="bg-white dark:bg-slate-950 py-10 overflow-hidden relative z-10">
      <div className="flex gap-4 animate-scroll whitespace-nowrap">
        {[...features, ...features].map((f, i) => (
          <div 
            key={i}
            className="px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest"
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}
