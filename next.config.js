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
        
        // Optimizaciones generales
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        
        return config;
    },
    // Reducir la cantidad de archivos observados
    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    }
};

module.exports = nextConfig;
