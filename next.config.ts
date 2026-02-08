import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/kugutsushi-web',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
