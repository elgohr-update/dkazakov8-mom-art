/**
 * @docs: https://webpack.js.org/configuration/module
 *
 */

import webpack from 'webpack';

import { ruleSvgInline } from '../rules/ruleSvgInline';
import { ruleSassServer } from '../rules/ruleSassServer';
import { ruleFontsServer } from '../rules/ruleFontsServer';
import { ruleBabelServer } from '../rules/ruleBabelServer';
import { ruleImagesServer } from '../rules/ruleImagesServer';

export const configModuleServer: webpack.Configuration['module'] = {
  rules: [ruleSvgInline, ruleSassServer, ruleBabelServer, ruleFontsServer, ruleImagesServer],
};
