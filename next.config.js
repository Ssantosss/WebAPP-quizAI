const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://api.deepseek.com https://generativelanguage.googleapis.com https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
    ].join('; ')
  },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self)' },
];

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  reactStrictMode: true,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};
