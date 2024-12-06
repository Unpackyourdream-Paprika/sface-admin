/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    PORT: 5000,
  },
  images: {
    domains: ["localhost"], // 허용할 외부 이미지 도메인 추가
  },
};

export default nextConfig;