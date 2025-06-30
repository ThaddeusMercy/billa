# Supabase Storage Setup for Avatar Uploads

## 1. Create Storage Bucket

1. **Go to your Supabase dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create avatars bucket**
   - Bucket name: `avatars`
   - Set as **Public bucket** (check the box)
   - Click "Create bucket"

## 2. Set up Storage Policies

Go to the Storage policies tab and create these policies:

### Policy 1: Allow users to upload their own avatars
```sql
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 2: Allow users to update their own avatars
```sql
CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 3: Allow users to delete their own avatars
```sql
CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Policy 4: Allow public access to view avatars
```sql
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

## 3. Alternative: Simple Public Access (if policies above don't work)

If the above policies cause issues, you can use simpler public policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Anyone can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Anyone can update avatars" ON storage.objects  
FOR UPDATE WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Anyone can delete avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

## 4. Test the Setup

After setting up the bucket and policies:

1. **Go to your app**: http://localhost:3001/account
2. **Click Edit** and try to upload a profile picture
3. **Check if the image uploads successfully**
4. **Verify the image URL is saved to the database**

## 5. Features Now Available

✅ **Upload profile pictures** - Images are stored in Supabase storage  
✅ **Automatic database update** - Avatar URL is saved to user profile  
✅ **Remove profile pictures** - Delete from both storage and database  
✅ **Proper file validation** - Size limits and file type checking  
✅ **Error handling** - User-friendly error messages  
✅ **Loading states** - Visual feedback during upload/delete  

## 6. File Constraints

- **Maximum file size**: 5MB
- **Allowed file types**: Images only (jpg, png, gif, webp, etc.)
- **File naming**: `{userId}-{timestamp}.{extension}`
- **Storage location**: `avatars/` folder in Supabase storage 