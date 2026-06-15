/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Block clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },
  // Force MIME-type as declared
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limit referrer info on cross-origin requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser feature access we don't use
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Force HTTPS for one year (only takes effect when served over https)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
];

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'ccc-backend.s3.us-east-2.amazonaws.com' },
    ],
  },
  async headers() {
    return [
      {
        // Apply to every route
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
