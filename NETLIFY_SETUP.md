# Netlify Configuration Guide

## Quick Fix for Username Creation Issue

You're getting timeout errors because Supabase environment variables aren't configured on Netlify. Here's how to fix it:

### 1. Add Environment Variables to Netlify

1. **Go to your Netlify site settings**: 
   - Visit: https://app.netlify.com/sites/comforting-hummingbird-73f137/settings/deploys#environment-variables

2. **Click "Add variable" and add these one by one**:

   ```
   Variable name: NEXT_PUBLIC_SUPABASE_URL
   Value: [Your Supabase Project URL]
   ```

   ```
   Variable name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
   Value: [Your Supabase Anon Key]
   ```

   ```
   Variable name: SUPABASE_SERVICE_ROLE_KEY
   Value: [Your Supabase Service Role Key]
   ```

   ```
   Variable name: NEXT_PUBLIC_SITE_URL
   Value: https://comforting-hummingbird-73f137.netlify.app
   ```

### 2. Get Your Supabase Credentials

If you don't have a Supabase project yet:

1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be ready (2-3 minutes)

2. **Get Your Credentials**:
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL (looks like: `https://abcdefgh.supabase.co`)
   - Copy your anon public key (starts with `eyJ...`)
   - Copy your service_role secret key (starts with `eyJ...`)

3. **Set Up Database**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql` from your project
   - Click "Run" to create all tables and functions

### 3. Configure Authentication

1. **In your Supabase dashboard**:
   - Go to Authentication → Settings
   - Set "Site URL" to: `https://comforting-hummingbird-73f137.netlify.app`
   - Add to "Redirect URLs": `https://comforting-hummingbird-73f137.netlify.app/auth/callback`

2. **For Google OAuth** (optional):
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your Google OAuth credentials

### 4. Redeploy Your Site

After adding the environment variables:
1. Go to your Netlify dashboard
2. Click "Deploys" tab
3. Click "Trigger deploy" → "Deploy site"
4. Wait for deployment to complete

### 5. Test the Fix

Once redeployed:
1. Visit your site: https://comforting-hummingbird-73f137.netlify.app
2. Try creating a username
3. It should work without timeout errors

## Troubleshooting

**Still getting errors?**
- Check that all environment variables are spelled correctly
- Make sure your Supabase project is active (not paused)
- Verify the database schema was set up correctly
- Check Netlify deploy logs for any build errors

**Need help?**
- Check the browser console for specific error messages
- Look at Netlify function logs in your dashboard
- Verify your Supabase project is accessible

The app will work in demo mode even without Supabase, but you'll need it configured for full functionality like user accounts and data persistence.