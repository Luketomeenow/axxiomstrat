import { getSupabase, isSupabaseConfigured } from './supabaseClient'

export const AI_ROADMAP_IMAGES_BUCKET = 'ai-roadmap-automations'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export function validateAutomationImage(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return 'Use JPEG, PNG, WebP, or GIF.'
  }
  if (file.size > MAX_BYTES) {
    return 'Image must be 5 MB or smaller.'
  }
  return null
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80) || 'image'
}

export async function uploadAutomationImage(
  file: File,
  path: { categoryId: string; blockId: string; subItemId: string },
): Promise<{ publicUrl: string | null; error: string | null }> {
  const validation = validateAutomationImage(file)
  if (validation) return { publicUrl: null, error: validation }

  if (!isSupabaseConfigured()) {
    return {
      publicUrl: null,
      error: 'Connect Supabase (VITE_SUPABASE_URL + anon key) to upload images for the team.',
    }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return { publicUrl: null, error: 'Supabase client unavailable.' }
  }

  const objectPath = `${path.categoryId}/${path.blockId}/${path.subItemId}/${Date.now()}-${safeName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from(AI_ROADMAP_IMAGES_BUCKET)
    .upload(objectPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    return { publicUrl: null, error: uploadError.message }
  }

  const { data } = supabase.storage.from(AI_ROADMAP_IMAGES_BUCKET).getPublicUrl(objectPath)
  return { publicUrl: data.publicUrl, error: null }
}

export async function removeAutomationImageByUrl(imageUrl: string): Promise<void> {
  if (!isSupabaseConfigured() || !imageUrl.includes('/object/public/')) return

  const supabase = getSupabase()
  if (!supabase) return

  try {
    const marker = `/object/public/${AI_ROADMAP_IMAGES_BUCKET}/`
    const idx = imageUrl.indexOf(marker)
    if (idx === -1) return
    const objectPath = decodeURIComponent(imageUrl.slice(idx + marker.length).split('?')[0])
    await supabase.storage.from(AI_ROADMAP_IMAGES_BUCKET).remove([objectPath])
  } catch {
    /* best-effort cleanup */
  }
}
