"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  glow?: boolean
}

export const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, ...props }, ref) => {
    const variants = {
      primary: "bg-primary-cyber text-background hover:bg-primary-cyber/90 shadow-[0_0_15px_rgba(0,243,255,0.5)]",
      secondary: "bg-secondary-cyber text-white hover:bg-secondary-cyber/90 shadow-[0_0_15px_rgba(255,0,255,0.5)]",
      outline: "border-2 border-primary-cyber text-primary-cyber hover:bg-primary-cyber/10",
      ghost: "text-primary-cyber hover:bg-primary-cyber/10",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base font-bold",
      lg: "px-8 py-4 text-lg font-black uppercase tracking-widest",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          glow && "hover:shadow-[0_0_25px_rgba(0,243,255,0.8)]",
          className
        )}
        {...props}
      />
    )
  }
)

NeonButton.displayName = "NeonButton"
