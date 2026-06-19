import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  framework: 'nextjs',
  buildCommand: 'pnpm --filter=!bl1nk-desktop build',
  installCommand: 'pnpm install',
};
