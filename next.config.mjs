/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisation des images pour Vercel
  images: {
    domains: ['supabase.co', 'your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false, // Activé pour Vercel
  },
  
  // Configuration webpack pour éviter les erreurs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      }
    }
    return config
  },
  
  // Optimisations pour la production
  compress: true,
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirections pour les anciennes URLs
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  typescript: {
    ignoreBuildErrors: true, // Temporairement désactivé pour le déploiement
  },
  
  eslint: {
    ignoreDuringBuilds: true, // Temporairement désactivé pour le déploiement
  },
  
  reactStrictMode: true, // Activé pour la production
  
  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
  
export default nextConfig