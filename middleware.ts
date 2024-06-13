export {default} from 'next-auth/middleware'

export const config = { matcher: ['/riservata', "/riservata/:path*" ] }