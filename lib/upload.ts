import { supabase } from './supabase'

const createAvatarsBucket = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      console.error('Failed to create avatars bucket:', error)
      return false
    }
    
    console.log('Avatars bucket created successfully')
    return true
  } catch (error) {
    console.error('Error creating bucket:', error)
    return false
  }
}

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new Error('File upload can only be performed in the browser')
  }
  
  try {
    console.log('Starting avatar upload...', { fileName: file.name, fileSize: file.size, userId })
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`
    
    console.log('Uploading to path:', filePath)

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase storage error:', error)
      throw new Error(`Storage upload failed: ${error.message}`)
    }

    console.log('Upload successful, getting public URL...', data)

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    console.log('Public URL generated:', urlData.publicUrl)
    return urlData.publicUrl
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      error: error
    })
    throw new Error(error.message || 'Failed to upload image')
  }
}

export const deleteAvatar = async (avatarUrl: string): Promise<void> => {
  try {
    // Extract file path from URL
    const url = new URL(avatarUrl)
    const pathSegments = url.pathname.split('/')
    const fileName = pathSegments[pathSegments.length - 1]
    const filePath = `avatars/${fileName}`

    // Delete file from storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      // Don't throw error for deletion failures
    }
  } catch (error) {
    console.error('Delete error:', error)
    // Don't throw error for deletion failures
  }
}

export const testBucketAccess = async (): Promise<void> => {
  try {
    console.log('Testing bucket access...')
    
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError)
      return
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name))
    
    let avatarsBucket = buckets?.find(b => b.name === 'avatars')
    if (!avatarsBucket) {
      console.log('Avatars bucket not found, creating it...')
      const created = await createAvatarsBucket()
      if (!created) {
        console.error('Failed to create avatars bucket!')
        return
      }
      
      const { data: updatedBuckets } = await supabase.storage.listBuckets()
      avatarsBucket = updatedBuckets?.find(b => b.name === 'avatars')
    }
    
    console.log('Avatars bucket found:', avatarsBucket)
    
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list()
    
    if (filesError) {
      console.error('Failed to list files in avatars bucket:', filesError)
    } else {
      console.log('Files in avatars bucket:', files?.length || 0)
    }
  } catch (error) {
    console.error('Bucket test error:', error)
  }
} 