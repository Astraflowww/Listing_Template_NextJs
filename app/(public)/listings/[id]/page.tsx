import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BuyerResponseForm } from '@/components/listings/BuyerResponseForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Calendar, Briefcase, User, Sparkles } from 'lucide-react'

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch listing details + seller profiles
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .eq('id', id)
    .single()

  // Check if listing exists and is approved (admins and owners can view pending too, let's keep it simple for now)
  if (!listing) {
    notFound()
  }

  // Double check status. If not approved, confirm if current user is owner or admin.
  if (listing.status !== 'approved') {
    const { data: { user } } = await supabase.auth.getUser()
    
    let isAuthorized = false
    if (user) {
      if (listing.seller_id === user.id) {
        isAuthorized = true
      } else {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (userProfile?.role === 'admin') {
          isAuthorized = true
        }
      }
    }

    if (!isAuthorized) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-6 text-center max-w-md mx-auto space-y-3">
            <h3 className="font-bold text-amber-600 dark:text-amber-400">Listing Pending Review</h3>
            <p className="text-sm text-muted-foreground">
              This listing has not been approved by the moderator yet. Please try again later.
            </p>
            <Link href="/" className="inline-block mt-2">
              <span className="text-sm font-semibold text-primary hover:underline">Back to Browse</span>
            </Link>
          </div>
        </div>
      )
    }
  }

  const sellerProfile = listing.profiles as any
  const fields = listing.form_schema as any[]

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Listing Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                {listing.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Posted on {new Date(listing.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              {listing.title}
            </h1>

            {listing.status === 'pending' && (
              <div className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                ⚠️ Pending Moderation Approval
              </div>
            )}
          </div>

          <div className="border-t border-border/40 pt-6">
            <h3 className="text-lg font-bold mb-4 text-primary">Job Description / Overview</h3>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm md:text-base">
              {listing.description || 'No description provided.'}
            </div>
          </div>

          {/* Seller profile card */}
          <div className="border-t border-border/40 pt-6">
            <Card className="border-border/50 bg-secondary/20 shadow-none">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-full bg-primary/15 p-3 text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Posted By</p>
                  <p className="font-semibold text-foreground text-base">
                    {sellerProfile?.full_name || 'Anonymous Seller'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Verified Seller Account
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Dynamic Form Submission Card */}
        <div className="lg:col-span-5">
          <Card className="border-border/50 bg-background/50 backdrop-blur-md shadow-lg sticky top-24">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-brand-purple/5 border-b pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                Apply for this role
              </CardTitle>
              <CardDescription>
                Fill out the seller&apos;s custom questionnaire below to submit your details.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <BuyerResponseForm listingId={listing.id} fields={fields} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
