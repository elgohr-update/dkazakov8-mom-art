/**
 * @docs: https://webpack.js.org/configuration/module
 *
 */

import webpack from 'webpack';

import { ruleSvgInline } from '../rules/ruleSvgInline';
import { ruleSassServer } from '../rules/ruleSassServer';
import { ruleSassThemes } from '../rules/ruleSassThemes';
import { ruleFontsServer } from '../rules/ruleFontsServer';
import { ruleBabelServer } from '../rules/ruleBabelServer';
import { ruleImagesServer } from '../rules/ruleImagesServer';

export const configModuleServer: webpack.Configuration['module'] = {
  rules: [
    ruleSvgInline,
    ruleSassServer,
    ruleSassThemes,
    ruleBabelServer,
    ruleFontsServer,
    ruleImagesServer,
  ],
};
