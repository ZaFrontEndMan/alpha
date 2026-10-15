# 🔐 Authentication Implementation Guide

## Overview

This guide shows how to add authentication to protect your admin panel using NextAuth.js. Without authentication, **anyone can access and modify your site data**.

---

## Option 1: NextAuth.js (Recommended)

### Step 1: Install Dependencies

```bash
npm install next-auth
```

### Step 2: Create Environment Variables

Create `.env.local`:

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-generate-this-randomly

# Admin credentials (for demo - use database in production)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### Step 3: Create Auth API Route

**File**: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // WARNING: In production, verify against a database with hashed passwords
        // This is a simplified example
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@alphacoaching.com",
            role: "admin"
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### Step 4: Create Middleware to Protect Routes

**File**: `middleware.ts` (in root directory)

```typescript
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Optionally, add custom logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated and has admin role
        return !!token && token.role === "admin"
      },
    },
  }
)

// Protect these routes
export const config = { 
  matcher: [
    "/admin/:path*",
    "/api/landing-data",
    "/api/upload"
  ] 
}
```

### Step 5: Create Login Page

**File**: `app/admin/login/page.tsx`

```typescript
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid username or password');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#090b0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#ccff00] mb-2">
            ALPHA ADMIN
          </h1>
          <p className="text-neutral-400 text-sm">
            Content Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#0c0f0d] border border-neutral-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-neutral-200 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#090b0a] border border-neutral-800 text-white
                  focus:outline-none focus:ring-2 focus:ring-[#ccff00] focus:ring-opacity-50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#090b0a] border border-neutral-800 text-white
                  focus:outline-none focus:ring-2 focus:ring-[#ccff00] focus:ring-opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-black uppercase tracking-wider
                bg-[#ccff00] text-black hover:bg-[#b5e600]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          Protected by NextAuth.js
        </div>
      </div>
    </div>
  );
}
```

### Step 6: Wrap App with SessionProvider

**File**: `app/layout.tsx`

```typescript
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

### Step 7: Protect Admin Panel Page

**File**: Update `app/admin/page.tsx`

Add this at the top:

```typescript
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AdminPanel() {
  const { data: session, status } = useSession();

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/admin/login');
  }

  // Rest of your admin panel code...
}
```

### Step 8: Add Logout Button

In your admin panel header, add:

```typescript
import { signOut } from 'next-auth/react';

// In your header JSX:
<button
  onClick={() => signOut({ callbackUrl: '/admin/login' })}
  className="px-4 py-2 text-sm font-bold uppercase
    bg-red-900/20 border border-red-800 text-red-300
    hover:bg-red-900/30 transition-all"
>
  Logout
</button>
```

---

## Option 2: Simple API Key Authentication (Quick & Basic)

### Step 1: Add Environment Variable

```bash
# .env.local
ADMIN_API_KEY=your-secret-api-key-here
```

### Step 2: Protect API Routes

**File**: Update `app/api/landing-data/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

function verifyApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.ADMIN_API_KEY;
}

export async function POST(request: NextRequest) {
  // Check API key
  if (!verifyApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Rest of your POST logic...
}
```

### Step 3: Update Admin Panel to Send API Key

**File**: Update `app/admin/page.tsx`

```typescript
const handleSubmit = async (values: SiteData) => {
  setIsSaving(true);

  try {
    const response = await fetch('/api/landing-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || '',
      },
      body: JSON.stringify(values),
    });

    // Rest of your logic...
  } catch (error) {
    console.error('Error saving:', error);
  }
};
```

**Note**: This is less secure than NextAuth and should only be used for internal tools.

---

## Option 3: Clerk (Modern, Easy Setup)

### Step 1: Install Clerk

```bash
npm install @clerk/nextjs
```

### Step 2: Get API Keys

1. Sign up at https://clerk.com
2. Create a new application
3. Copy your API keys

### Step 3: Add Environment Variables

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 4: Wrap App with ClerkProvider

**File**: `app/layout.tsx`

```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Step 5: Protect Admin Route

**File**: `middleware.ts`

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/landing-data((?!/POST).*)"],
  ignoredRoutes: []
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Step 6: Add Sign In/Out

Clerk provides built-in UI components:

```typescript
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

export default function AdminPanel() {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignInButton mode="modal" />
      </div>
    );
  }

  return (
    <div>
      <header>
        <span>Welcome, {user.firstName}!</span>
        <SignOutButton />
      </header>
      {/* Rest of admin panel */}
    </div>
  );
}
```

---

## Comparison

| Feature | NextAuth.js | API Key | Clerk |
|---------|-------------|---------|-------|
| Setup Difficulty | Medium | Easy | Easy |
| Security | High | Low | Very High |
| Cost | Free | Free | Free tier available |
| User Management | DIY | None | Built-in |
| OAuth Support | Yes | No | Yes |
| Best For | Custom auth | Internal tools | Production apps |

---

## Recommended: NextAuth.js

For this project, **NextAuth.js is recommended** because:

1. ✅ Free and open-source
2. ✅ Flexible authentication strategies
3. ✅ Works with existing Next.js setup
4. ✅ No external dependencies
5. ✅ Can upgrade to database later

---

## Testing Authentication

After implementing:

1. **Try accessing admin without login**:
   ```
   http://localhost:3000/admin
   ```
   Should redirect to `/admin/login`

2. **Try invalid credentials**:
   - Enter wrong username/password
   - Should see error message

3. **Try valid credentials**:
   - Enter correct username/password
   - Should redirect to admin panel

4. **Try accessing API without auth**:
   ```bash
   curl -X POST http://localhost:3000/api/landing-data
   ```
   Should return 401 Unauthorized

5. **Test logout**:
   - Click logout button
   - Should redirect to login
   - Accessing `/admin` should require login again

---

## Production Considerations

### Use a Database for User Storage

Replace the hardcoded credentials with a database:

```typescript
// Example with Prisma
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async authorize(credentials) {
  const user = await prisma.user.findUnique({
    where: { username: credentials.username }
  })

  if (!user) return null

  const isValid = await bcrypt.compare(
    credentials.password,
    user.hashedPassword
  )

  if (!isValid) return null

  return { id: user.id, email: user.email, role: user.role }
}
```

### Enable 2FA (Two-Factor Authentication)

Consider adding 2FA with:
- Email verification codes
- SMS codes (Twilio)
- Authenticator apps (TOTP)

### Session Security

```typescript
session: {
  strategy: "jwt",
  maxAge: 24 * 60 * 60, // 24 hours
  updateAge: 60 * 60, // Update every hour
},
jwt: {
  maxAge: 60 * 60 * 24, // 24 hours
}
```

### HTTPS Only

In production:

```typescript
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true // HTTPS only
    }
  }
}
```

---

## Support

- NextAuth.js Docs: https://next-auth.js.org
- Clerk Docs: https://clerk.com/docs
- Next.js Auth: https://nextjs.org/docs/authentication

---

**🔒 Security is critical - don't skip authentication!**
