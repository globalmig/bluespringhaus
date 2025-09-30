/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bluespringhaus-rbt5.vercel.app",
      },
      {
        protocol: "https",
        hostname: "kghdzpscgyzamqtorjuo.supabase.co",
      },
    ],
  },
};

export default nextConfig;
