'use client'

import React from 'react'
import { Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TokenBadgeProps {
  tokens: number
  className?: string
  showText?: boolean
}

export function TokenBadge({ tokens, className, showText = true }: TokenBadgeProps) {
  const isZero = tokens === 0
  const isLow = tokens > 0 && tokens <= 2

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300",
        isZero
          ? "bg-destructive/10 border-destructive/30 text-destructive shadow-[0_0_12px_rgba(239,68,68,0.1)] animate-pulse"
          : isLow
          ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
          : "bg-primary/10 border-primary/30 text-primary shadow-[0_0_12px_rgba(139,92,246,0.1)]",
        className
      )}
    >
      <Coins className={cn("h-3.5 w-3.5", isZero && "animate-spin-slow")} />
      <span>
        {tokens} {showText && (tokens === 1 ? 'Token' : 'Tokens')}
      </span>
    </div>
  )
}
