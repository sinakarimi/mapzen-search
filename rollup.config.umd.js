import isBuiltin from 'is-builtin-module'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { external } from './rollup.shared.js'

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'mapzenSearch',
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          "es2015",
          {
            modules: false
          }
        ]
      ],
      plugins: [
        "external-helpers"
      ],
      babelrc: false,
    })
  ],
  dest: 'build/bundle.js',
  external,
}
