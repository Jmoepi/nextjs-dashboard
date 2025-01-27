import type { NextConfig } from 'next';
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  experimental: {
    //serverActions: true
    ppr: 'incremental'
  },
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
};
module.exports = nextConfig;
//export default nextConfig;
