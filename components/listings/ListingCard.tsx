'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Briefcase, ChevronRight, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ListingCardProps {
  id: string
  title: string
  description: string | null
  category: string
  createdAt: string
  sellerName?: string
}

export function ListingCard({
  id,
  title,
  description,
  category,
  createdAt,
  sellerName,
}: ListingCardProps) {
  // Category-specific badge styles using the report palette from DESIGN.md
  const categoryStyles: Record<string, string> = {
    driver: 'bg-[#65b5ff]/10 text-[#006bd6] border-[#65b5ff]/20', // report-blue
    event: 'bg-[#0bdf50]/10 text-[#079c37] border-[#0bdf50]/20', // report-green
    service: 'bg-fin-orange/10 text-fin-orange border-fin-orange/20', // fin-orange
    real_estate: 'bg-[#03b2cb]/10 text-[#028194] border-[#03b2cb]/20', // report-cyan
    other: 'bg-[#ff2067]/10 text-[#cc0044] border-[#ff2067]/20', // report-pink
  }

  const selectedCategoryStyle = categoryStyles[category] || categoryStyles.other

  return (
    <Card className="flex flex-col h-full border-border bg-card hover:border-foreground/30 transition-all duration-200 group overflow-hidden rounded-lg shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize",
              selectedCategoryStyle
            )}
          >
            {category.replace('_', ' ')}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <CardTitle className="text-lg font-medium tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] lg:tracking-[-0.3px]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="pt-4 pb-5 px-6 border-t border-border/40 mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[150px]">
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{sellerName || 'Anonymous Seller'}</span>
        </div>
        <Link href={`/listings/${id}`}>
          <Button
            size="sm"
            variant="secondary"
            className="border border-border text-foreground hover:bg-secondary cursor-pointer transition-all duration-200"
          >
            Apply Now
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
