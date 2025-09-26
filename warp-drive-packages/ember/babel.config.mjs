import { macros } from '@warp-drive/core/build-config/babel-macros';

import { buildMacros } from '@embroider/macros/babel';

const IS_UNPKG_BUILD = Boolean(process.env.UNPKG_BUILD);
let Macros = { babelMacros: [], templateMacros: [] };

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
    '@embroider/addon-dev/template-colocation-plugin',
    [
      'babel-plugin-ember-template-compilation',
      {
        targetFormat: 'hbs',
        transforms: Macros.templateMacros,
      },
    ],
    ['module:decorator-transforms', { runtime: { import: 'decorator-transforms/runtime' } }],
    ...Macros.babelMacros,
  ],
};
