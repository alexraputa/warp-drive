import { createConfig } from '@warp-drive/internal-config/vite/config.js';

export const externals = ['react'];
export const entryPoints = ['./src/index.ts', './src/install.ts'];

export default createConfig(
  {
    entryPoints,
    externals,
    plugins: [],
    compileTypes: process.env.IS_UNPKG_BUILD !== 'true',
  },
  import.meta.resolve
);
