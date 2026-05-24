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
  // Category-specific badge styles
  const categoryStyles: Record<string, string> = {
    driver: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    event: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    service: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    real_estate: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    other: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  }

  const selectedCategoryStyle = categoryStyles[category] || categoryStyles.other

  return (
    <Card className="flex flex-col h-full border-border/50 bg-background/50 backdrop-blur-md hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold capitalize",
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
        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-5 px-6 border-t border-border/40 mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[150px]">
          <User className="h-3.5 w-3.5" />
          <span className="truncate">{sellerName || 'Anonymous Seller'}</span>
        </div>
        <Link href={`/listings/${id}`}>
          <Button
            size="sm"
            variant="ghost"
            className="group-hover:bg-primary group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300 gap-1 text-xs cursor-pointer"
          >
            Apply Now
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
