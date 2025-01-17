/**
 * @fileOverview setup dotenv, read .env .env.${NODE_ENV} .env.${NODE_ENV}.local
 * @name setup-dotenv.js
 */

const fs = require('fs')

const NODE_ENV = process.env.NODE_ENV

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  NODE_ENV && `.env.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  NODE_ENV && `.env.${NODE_ENV}`,
  '.env',
].filter(Boolean)

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    )
  }
})

// expose all SNOWPACK_PUBLIC_ env to process.env
for (const e in process.env) {
  if (e.startsWith('SNOWPACK_PUBLIC_')) {
    process.env[e.slice(16)] = process.env[e]
  }
}
