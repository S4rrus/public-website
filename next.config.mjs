/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'ctftime.org' },
      { protocol: 'https', hostname: 'www.ctftime.org' }
    ]
  }
};

export default nextConfig;
