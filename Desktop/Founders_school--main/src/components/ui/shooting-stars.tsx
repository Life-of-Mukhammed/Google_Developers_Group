"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function ShootingStars() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; duration: number; delay: number; angle: number }[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: 50, // center
        y: 50, // center
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 5,
        angle: Math.random() * 360,
      }))
      setStars(newStars)
    }
    generateStars()
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: "50vw",
            y: "50vh"
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0.5],
            x: `${50 + Math.cos(star.angle) * 100}vw`,
            y: `${50 + Math.sin(star.angle) * 100}vh`,
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeOut"
          }}
          className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
          style={{
            boxShadow: "0 0 10px var(--primary)",
          }}
        />
      ))}
    </div>
  )
}