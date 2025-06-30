# Complete Deployment Setup Guide

## 🚀 Quick Setup Checklist

### 1. Supabase Setup (5 minutes)
1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose organization and enter project details
   - Wait for project to be ready (2-3 minutes)

2. **Get Your Credentials**
   - Go to Settings → API
   - Copy your Project URL and anon public key
   - Copy your service_role secret key

3. **Set Up Database**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Click "Run" to create all tables and functions

4. **Configure Authentication**
   - Go to Authentication → Settings
   - Add your domain to "Site URL": `https://your-site.netlify.app`
   - For Google OAuth: Go to Providers → Google → Enable
   - Add redirect URLs: `https://your-site.netlify.app/auth/callback`

### 2. Local Development Setup (2 minutes)
1. **Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   ```

2. **Install Dependencies & Run**
   ```bash
   npm install
   npm run dev
   ```

### 3. Netlify Deployment (3 minutes)
1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Click "Deploy site"

2. **Configure Environment Variables**
   - In Netlify dashboard, go to your site
   - Site settings → Build & deploy → Environment variables
   - Add these variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
     SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
     NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
     ```

3. **Update Supabase Settings**
   - Go back to Supabase → Authentication → Settings
   - Update "Site URL" to your Netlify URL
   - Add your Netlify URL to redirect URLs

### 4. Alternative: Vercel Deployment
1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables during setup

## 🔧 Detailed Setup Instructions

### Supabase Database Schema
Your database schema is already prepared in `supabase-schema.sql`. This includes:
- ✅ User profiles with username support
- ✅ Payment methods with drag & drop ordering
- ✅ Row Level Security (RLS) policies
- ✅ Public access for username sharing
- ✅ Automatic profile creation on signup

### Environment Variables Explained
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY`: Secret key for server-side operations
- `NEXT_PUBLIC_SITE_URL`: Your deployed site URL (for OAuth redirects)

### Features Included
- ✅ User authentication (email/password + Google OAuth)
- ✅ Username creation and profile management
- ✅ Payment method management with drag & drop
- ✅ Public profile sharing (billa.gg/username)
- ✅ Avatar upload to Supabase storage
- ✅ Mobile-responsive design
- ✅ Production-ready deployment configuration

## 🐛 Troubleshooting

### Build Errors
- **"supabaseUrl is required"**: Add environment variables to Netlify
- **"Module not found"**: Run `npm install` to install dependencies
- **"Authentication error"**: Check Supabase URL and keys are correct

### Runtime Errors
- **"Invalid JWT"**: Check your anon key is correct
- **"Row Level Security"**: Ensure RLS policies are set up correctly
- **"CORS errors"**: Add your domain to Supabase allowed origins

### Common Issues
1. **Environment variables not working**: Make sure they start with `NEXT_PUBLIC_` for client-side access
2. **OAuth not working**: Check redirect URLs match exactly in Supabase settings
3. **Database errors**: Ensure you've run the schema setup SQL

## 📞 Support
If you encounter issues:
1. Check the browser console for error messages
2. Check Supabase logs in your dashboard
3. Verify all environment variables are set correctly
4. Ensure your database schema is set up properly

## 🎉 Success!
Once everything is set up, you should be able to:
- Sign up/login with email or Google
- Create a username and profile
- Add payment methods
- Share your profile at `your-site.netlify.app/username`