const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/bot',
                permanent: true,
            },

        ];
    },
};

export default nextConfig;
