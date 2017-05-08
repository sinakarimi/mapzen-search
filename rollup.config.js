// rollup.config.js
import isBuiltin from 'is-builtin-module'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

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
      exclude: 'node_modules/**'
    })
  ],
  dest: 'build/bundle.js',
  external: id => {
    // Ignore builtin node modules for bundling.
    // Relevant for Node.js modules (e.g node-fetch)
    if (isBuiltin(id)) return true

    // https://github.com/bitinn/node-fetch/blob/master/rollup.config.js
    id = id.split('/').slice(0, id[0] === '@' ? 2 : 1).join('/')
    return !!require('./package.json').dependencies[id]
  }
}
