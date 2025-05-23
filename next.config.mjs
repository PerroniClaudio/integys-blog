/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  swcMinify: false, // Disabilita la minificazione con Terser
  webpack(config) {
    config.optimization.minimize = false; // Disabilita la minificazione
    return config;
  },
};

export default nextConfig;
