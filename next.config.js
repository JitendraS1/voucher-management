/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This makes it a static export
  trailingSlash: true, // Ensures HTML files are generated with .html extensions
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    unoptimized: true // Required for static exports
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make pdfjs work
    return config;
  },
};

module.exports = nextConfig;