/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['50cb1v0h-3000.inc1.devtunnels.ms','ltdxxqeuuoibizgjzxqo.supabase.co'],
    },
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
