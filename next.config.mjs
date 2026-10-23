import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // allows local WebP without image optimizer server requirement
  },
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
