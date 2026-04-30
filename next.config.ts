import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable strict mode for better development experience
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
