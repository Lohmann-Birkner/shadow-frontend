/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ["en", "de"],
        defaultLocale: "de",
        localeDetection: false,
    },
    reactStrictMode: true,
    swcMinify: false,
};

module.exports = nextConfig;
