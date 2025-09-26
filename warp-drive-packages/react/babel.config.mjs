import { macros } from '@warp-drive/core/build-config/babel-macros';

import { buildMacros } from '@embroider/macros/babel';

const IS_UNPKG_BUILD = Boolean(process.env.UNPKG_BUILD);
let Macros = { babelMacros: [] };

if (IS_UNPKG_BUILD) {
  Macros = buildMacros({
    configure: (config) => {
      setConfig(config, {
        compatWith: process.env.EMBER_DATA_FULL_COMPAT ? '99.0' : null,
        forceMode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      });
    },
  });
}

export default {
  presets: [
    [
      '@babel/preset-react',
      { useBuiltIns: true, runtime: 'automatic', development: process.env.NODE_ENV !== 'production' },
    ],
  ],
  plugins: [
    ...macros(),
    [
      '@babel/plugin-transform-typescript',
      { allExtensions: true, isTSX: true, onlyRemoveTypeImports: true, allowDeclareFields: true },
    ],
    ['module:decorator-transforms', { runtime: { import: 'decorator-transforms/runtime' } }],
    ...Macros.babelMacros,
  ],
};
