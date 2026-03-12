'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Blog Posts
 */
export async function upsertBlogPost(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  
  const postData = {
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    status: formData.get('status') as 'published' | 'draft',
    thumbnail_url: formData.get('thumbnail_url') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string || 'Admin',
  }

  let error
  if (id) {
    ({ error } = await supabase.from('blog_posts').update(postData).eq('id', id))
  } else {
    ({ error } = await supabase.from('blog_posts').insert([postData]))
  }

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}

/**
 * Radio Settings
 */
export async function updateRadioSettings(formData: FormData) {
  const supabase = await createClient()
  const idFromForm = formData.get('id') as string
  
  const settings: any = {
    is_live: formData.get('is_live') === 'true',
    current_show: formData.get('current_show') as string,
    current_host: formData.get('current_host') as string,
    live_type: (formData.get('live_type') as string) || 'audio',
    facebook_url: formData.get('facebook_url') as string,
    meeting_url: formData.get('meeting_url') as string,
    updated_at: new Date().toISOString(),
  }

  const streamUrl = formData.get('stream_url')
  if (streamUrl !== null) {
    settings.stream_url = streamUrl as string
  }

  // If ID is missing, try to find the first existing one or just insert
  let query = supabase.from('radio_settings')
  let error

  if (idFromForm && idFromForm.length === 36) {
    ({ error } = await query.update(settings).eq('id', idFromForm))
  } else {
    // Try to update the first row regardless of ID, or upsert if none exist
    // Get existing ID first
    const { data: existing } = await supabase.from('radio_settings').select('id').limit(1).maybeSingle()
    if (existing) {
      ({ error } = await supabase.from('radio_settings').update(settings).eq('id', existing.id))
    } else {
      ({ error } = await supabase.from('radio_settings').insert([settings]))
    }
  }

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}

/**
 * Radio Schedule
 */
export async function upsertScheduleSlot(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  
  const slotData = {
    time_slot: formData.get('time_slot') as string,
    show_name: formData.get('show_name') as string,
    host: formData.get('host') as string,
    is_current: formData.get('is_current') === 'true',
  }

  let error
  if (id) {
    ({ error } = await supabase.from('radio_schedule').update(slotData).eq('id', id))
  } else {
    ({ error } = await supabase.from('radio_schedule').insert([slotData]))
  }

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}

export async function deleteScheduleSlot(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('radio_schedule').delete().eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}

/**
 * Animators
 */
export async function manageAnimator(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string | null
  const isDelete = formData.get('delete') === 'true'

  if (isDelete && id) {
    const { error } = await supabase.from('animators').delete().eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const animatorData = {
      name: formData.get('name') as string,
      initials: formData.get('initials') as string,
      role: formData.get('role') as string,
      is_online: formData.get('is_online') === 'true',
      avatar_url: formData.get('avatar_url') as string,
    }

    let error
    if (id) {
      ({ error } = await supabase.from('animators').update(animatorData).eq('id', id))
    } else {
      ({ error } = await supabase.from('animators').insert([animatorData]))
    }
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/admin_dashboard')
}

/**
 * Inquiries
 */
export async function toggleInquiryRead(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('contact_inquiries').update({ is_read: !currentStatus }).eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin_dashboard')
}
