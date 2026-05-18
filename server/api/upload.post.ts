export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  const file = formData[0]

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!file.type || !allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Only JPEG, PNG, and WebP images are allowed' })
  }

  // Validate file size (2MB max)
  const maxSize = 2 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File size exceeds 2MB limit' })
  }

  const ext = file.type.split('/')[1] === 'jpeg' ? 'jpg' : file.type.split('/')[1]
  const filename = `${Date.now()}.${ext}`
  const path = `articles/${filename}`

  const supabase = useSupabaseAdmin()
  const { error } = await supabase.storage
    .from('thumbnails')
    .upload(path, file.data, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Upload failed: ${error.message}` })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('thumbnails')
    .getPublicUrl(path)

  return { url: publicUrl }
})
