const withTwin = require('./withTwin.js')

/**
 * @type {import('next').NextConfig}
*/
module.exports = withTwin({
  // swcMinify: true,
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
})