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
  plugins: [
    ...macros(),
    [
      '@babel/plugin-transform-typescript',
      { allExtensions: true, onlyRemoveTypeImports: true, allowDeclareFields: true },
    ],
    ...Macros.babelMacros,
  ],
};
