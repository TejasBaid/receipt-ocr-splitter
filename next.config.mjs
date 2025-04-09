import nextPWA from 'next-pwa';
const withPWA = nextPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false,
});
const nextConfig = {
    reactStrictMode: true,
};


export default withPWA(nextConfig);