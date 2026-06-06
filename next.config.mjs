/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'aarambh.jklu.edu.in',
      pathname: '/**',
    }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.cashfree.com https://apis.google.com https://www.gstatic.com; connect-src 'self' https://*.cashfree.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com; frame-src 'self' https://*.cashfree.com https://*.google.com https://*.google.co.in; img-src 'self' data: https: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; object-src 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), geolocation=(), microphone=()'
          }
        ],
      },
    ];
  },
}

export default nextConfig;