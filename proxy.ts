import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = { 
  matcher: ['/riservata', "/riservata/:path*"] 
}

// Funzione proxy per Next.js 16
export function proxy(req: NextRequest) {
  return NextResponse.next();
}