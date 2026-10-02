import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Prevent Turbopack from bundling supabase-js (fixes compile hang)
  serverExternalPackages: ['@supabase/supabase-js'],
};

export default withSentryConfig(nextConfig, {
  org: "remote-hirring",
  project: "hiring-remote",   // was "javascript-nextjs" — wrong project name
  silent: !process.env.CI,
  widenClientFileUpload: true,

  // tunnelRoute removed — was adding an extra Vercel function call per page load

  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});