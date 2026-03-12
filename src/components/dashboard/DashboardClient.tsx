'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardClient() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to all changes in the public schema
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          console.log('Change received!', payload)
          // Refresh the current route to fetch new data from the server
          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  // This component doesn't render anything visible
  return null
}
