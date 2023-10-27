/** @type {import('next').NextConfig} */
const nextConfig = {
    // async redirects() {
    //     return [
    //         {
    //             source: "/",
    //             destination: "/versicherten",
    //             permanent: true,
    //         },
    //     ];
    // },
    i18n: {
        locales: ["en", "de"],
        defaultLocale: "de",
        localeDetection: false,
    },
    reactStrictMode: true,
    swcMinify: false,
};

module.exports = nextConfig;
