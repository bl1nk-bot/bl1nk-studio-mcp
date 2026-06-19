import pkg from '@vercel/config/v1';

const { defineConfig } = pkg;

export default defineConfig({
  framework: 'nextjs',
  rootDirectory: 'packages/support-agent',
  buildCommand: 'pnpm --filter=!bl1nk-desktop build',
  installCommand: 'pnpm install',
  ignoredRoutes: [
    '/packages/bl1nk-desktop/(.*)',
  ],
});
