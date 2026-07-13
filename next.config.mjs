/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Media is served from /public/media after `npm run fetch:assets`.
    // No remote patterns needed — nothing loads from the Instagram CDN at runtime.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
