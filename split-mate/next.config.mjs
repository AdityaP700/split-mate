/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'media.istockphoto.com',
      pathname: '**',
    },
    {
      protocol: 'https',
      hostname: 'api.dicebear.com',
      port: '',
      pathname: '**',
    },
  ],
},

  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
