// vim: set ft=javascript fdm=marker et ff=unix tw=80 sw=2:

import { resolve } from 'path'
import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import globals from '@allex/rollup-plugin-node-globals'
import babelrc from '.babelrc'

const { version, name, author, license, dependencies } = require('./package.json')

const banner = (name, short = false) => {
  let s;
  if (short) {
    s = `/*! ${name} v${version} | ${license} licensed | ${author.name | author} */`
  } else {
    s = `/*!
 * ${name} v${version}
 *
 * @author ${author}
 * Released under the ${license} license.
 */`
  }
  return s
}

export default {
  destDir: resolve(__dirname, './lib'),
  dependencies: Object.keys(dependencies).concat([ 'fs', 'path', 'events', 'module', 'util' ]),
  pluginOptions: {
    babel (rollupCfg) {
      const cfg = {
        ...babelrc,
        babelrc: false,
        externalHelpers: false,
        runtimeHelpers: false
      }
      return cfg
    }
  },
  entry: [
    {
      input: 'src/index.js',
      plugins: [
        'resolve',
        'commonjs',
        babel,
        builtins,
        globals,
      ],
      targets: [
        { format: 'umd', file: 'index.js', name: 'BTrackerClient', banner: banner(name) },
        { format: 'es', file: 'index.esm.js', banner: banner(name, true) }
      ]
    }
  ]
}
