/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        backend_url: process.env.NODE_ENV ? process.env.NODE_ENV : "dev"
    },
    sassOptions: {
        includePaths: ['./styles'],
    },
    webpack: (config, { isServer }) => {
        // Configuración específica para el servidor
        if (isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false
            };
        }
        return config;
    }
};

module.exports = nextConfig;
