import path from 'path';

import _ from 'lodash';
import webpack from 'webpack';

class DependencyGraphPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('DependencyGraphPlugin', compilation => {
      let deps = [];
      const whiteList = ['components', 'autorun', 'api', 'actions', 'stores'];

      compilation.modules.forEach(m => {
        if (!m.resource) return;

        const [file, issuer] = [
          path.relative('', m.resource),
          m.issuer && m.issuer.resource && path.relative('', m.issuer.resource),
        ]
          .map(p => p || '')
          .map(p => p.replace(/\\/g, '/'));

        if (file && issuer && file !== issuer) {
          /**
           * We need only top-level graph relative to src/ without imports inside one group
           *
           */

          let fileBaseFolder = file.split('/')[1];
          let issuerBaseFolder = issuer.split('/')[1];

          /**
           * Pages are actually components
           * but formConfigs are a part of store, but using some styles from components,
           * so have to treat them as components, just a hack
           *
           */

          if (['pages', 'formConfigs'].includes(fileBaseFolder)) fileBaseFolder = 'components';
          if (['pages', 'formConfigs'].includes(issuerBaseFolder)) issuerBaseFolder = 'components';

          if (
            fileBaseFolder !== issuerBaseFolder &&
            whiteList.includes(fileBaseFolder) &&
            whiteList.includes(issuerBaseFolder)
          ) {
            deps.push([issuerBaseFolder, fileBaseFolder]);
          }
        }
      });

      /**
       * Manual filling because we excluded client.tsx (Webpack entry point)
       * in which these connections established
       *
       */

      const context = ['stores', 'actions', 'api'];
      context.forEach(param => {
        if (!['actions'].includes(param)) deps.push(['actions', param]);
        if (!['components'].includes(param)) deps.push(['components', param]);
        deps.push(['autorun', param]);
      });

      deps = _.uniqBy(deps, JSON.stringify);

      const source = `digraph sources {
  rankdir=LR;
  ${deps.map(d => `"${d[0]}" -> "${d[1]}";`).join('\n\t')} 
}`;

      compilation.assets['graph.dot'] = {
        source() {
          return source;
        },
        size() {
          return source.length;
        },
      };
    });
  }
}

export const pluginDepsGraph: webpack.WebpackPluginInstance = new DependencyGraphPlugin();
