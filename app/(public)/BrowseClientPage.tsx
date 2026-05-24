'use client'

import React, { useState, useMemo } from 'react'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { Input } from '@/components/ui/input'
import { Search, Sparkles, SlidersHorizontal, Briefcase, Car, CalendarClock, Home, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Listing {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
  profiles?: {
    full_name: string | null
  }
}

interface BrowseClientPageProps {
  initialListings: Listing[]
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'driver', label: 'Drivers', icon: Car },
  { id: 'event', label: 'Events & Help', icon: CalendarClock },
  { id: 'service', label: 'Services', icon: Briefcase },
  { id: 'real_estate', label: 'Real Estate', icon: Home },
  { id: 'other', label: 'Others', icon: Sparkles },
]

export default function BrowseClientPage({ initialListings }: BrowseClientPageProps) {
  const listings = initialListings || []
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter listings based on category selection & search input
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesCategory =
        selectedCategory === 'all' || listing.category === selectedCategory

      const matchesSearch =
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        (listing.description?.toLowerCase() || '').includes(search.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [listings, selectedCategory, search])

  // Count listings per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: listings.length }
    listings.forEach((listing) => {
      counts[listing.category] = (counts[listing.category] || 0) + 1
    })
    return counts
  }, [listings])

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-brand-purple/5 to-transparent py-16 sm:py-24 border-b border-border/20">
        {/* Glow circles */}
        <div className="absolute top-10 left-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 h-96 w-96 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-semibold text-primary animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Discover Local Opportunities
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto leading-tight">
            Connecting Talent with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-purple">
              Dynamic Forms
            </span>
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Sellers create custom questions to get exactly the info they need. Buyers apply in seconds with zero friction.
          </p>

          {/* Search bar wrapper */}
          <div className="max-w-xl mx-auto relative group pt-4">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary to-brand-purple opacity-20 blur group-hover:opacity-35 transition duration-300" />
            <div className="relative flex items-center bg-background rounded-2xl border border-border/80 p-1.5 shadow-md">
              <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
              <Input
                type="text"
                placeholder="Search listings by title, keywords or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-6 text-sm md:text-base w-full shadow-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main browse feed & filter section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Categories Sidebar Filter */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2 border-b pb-3">
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-foreground">
                Filter Listings
              </h2>
            </div>

            <div className="flex flex-row overflow-x-auto gap-2 lg:flex-col pb-3 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const count = categoryCounts[cat.id] || 0
                const isSelected = selectedCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer w-full group text-left",
                      isSelected
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                        : "bg-background border-border/60 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("h-4.5 w-4.5 shrink-0", isSelected ? "text-white" : "text-primary/70 group-hover:scale-105 transition-transform")} />
                      <span>{cat.label}</span>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Listings Feed */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {selectedCategory === 'all'
                  ? 'All Postings'
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
              </h3>
              <p className="text-xs text-muted-foreground font-semibold">
                Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            <ListingGrid listings={filteredListings} />
          </div>
        </div>
      </div>
    </div>
  )
}
