# Supabase Authentication Setup

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note your project URL and anon key

## 2. Environment Variables
Create `.env.local` in your root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Database Setup
Run the SQL from `supabase-schema.sql` in your Supabase SQL editor:
- Creates profiles table
- Sets up Row Level Security (RLS)
- Creates triggers for auto profile creation

## 4. Authentication Setup
- Email/Password auth is enabled by default
- For Google auth, configure OAuth in Supabase dashboard
- Add your domain to allowed origins

## 5. Features Included
- ✅ User registration/login
- ✅ Automatic profile creation
- ✅ Profile management
- ✅ Protected routes
- ✅ Session management
- ✅ Row Level Security

## 6. Usage
Users can now:
- Sign up with email/password
- Sign in and maintain sessions
- Edit their profiles
- Access protected pages
- Sign out securely 