/**
 * @docs: https://webpack.js.org/configuration/optimization
 *
 */
import webpack from 'webpack';

import { env } from '../../env';
import { getTerserConfig } from '../utils/getTerserConfig';

export const configOptimizationServer: webpack.Options.Optimization = {
  minimize: env.getParamAsBoolean('MINIMIZE_SERVER'),
  minimizer: [getTerserConfig()],
};
