/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Compiler configuration
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: {
      // Enabled by default in development, disabled in production to reduce file size,
      // setting this will override the default for all environments.
      displayName: process.env.NODE_ENV === "development",
      // Enabled by default.
      ssr: true,
      // Enabled by default.
      fileName: process.env.NODE_ENV === "development",
      // Empty by default.
      topLevelImportPaths: [],
      // Defaults to ["index"].
      meaninglessFileNames: ["index"],
      // Enabled by default.
      minify: true,
      // Enabled by default.
      transpileTemplateLiterals: true,
      // Empty by default.
      namespace: "",
      // Disabled by default.
      pure: false,
      // Enabled by default.
      cssProp: true,
    },
  },
  // Optimized for Next.js 15+
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "styled-components"],
  },
}

module.exports = nextConfig
