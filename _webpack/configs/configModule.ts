/**
 * @docs: https://webpack.js.org/configuration/module
 *
 */

import webpack from 'webpack';

import { ruleSass } from '../rules/ruleSass';
import { ruleBabel } from '../rules/ruleBabel';
import { ruleFonts } from '../rules/ruleFonts';
import { ruleImages } from '../rules/ruleImages';
import { ruleSvgInline } from '../rules/ruleSvgInline';
import { ruleSassThemes } from '../rules/ruleSassThemes';
import { ruleLegacyFiles } from '../rules/ruleLegacyFiles';

export const configModule: webpack.Configuration['module'] = {
  rules: [
    ruleSass,
    ruleBabel,
    ruleFonts,
    ruleImages,
    ruleSvgInline,
    ruleSassThemes,
    ruleLegacyFiles,
  ],
};
