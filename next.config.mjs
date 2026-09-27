/** @type {import('next').NextConfig} */
const nextConfig = {
  // gzip buffers Server-Sent Events in `next start`; loopback traffic does not need it
  compress: false,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.20.10.*"],
};
export default nextConfig;
