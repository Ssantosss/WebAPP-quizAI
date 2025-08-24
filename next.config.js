const securityHeaders = [
  { key: 'Cache-Control', value: 'no-store' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https: blob:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://api.deepseek.com https://generativelanguage.googleapis.com https://api.stripe.com https://*.supabase.co https://*.supabase.in",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
    ].join('; ')
  },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  reactStrictMode: true,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};
