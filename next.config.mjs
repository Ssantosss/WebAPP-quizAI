/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=()' },
          { key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob:",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-eval'",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in",
              "frame-ancestors 'none'"
            ].join('; ')
          },
        ],
      },
      { source: '/quiz', headers: [{ key: 'Permissions-Policy', value: 'camera=(self)' }] },
    ];
  },
};
export default nextConfig;
