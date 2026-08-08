import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: false, // Tetap aktif di prod
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 💡 Mengizinkan konfig webpack bawaan PWA agar tidak error di Next.js 16 (Turbopack)
  experimental: {
    turbopack: {},
  },
};

export default withPWA(nextConfig);