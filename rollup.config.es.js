import resolve from 'rollup-plugin-node-resolve';
import { external } from './rollup.shared.js'

export default {
  entry: 'src/index.js',
  format: 'es',
  plugins: [
    resolve(),
  ],
  dest: 'build/bundle.es2015.js',
  external,
}
