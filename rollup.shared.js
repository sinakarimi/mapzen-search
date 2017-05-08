import isBuiltin from 'is-builtin-module'

export const external = id => {
  // Ignore builtin node modules for bundling.
  // Relevant for Node.js modules (e.g node-fetch)
  if (isBuiltin(id)) return true

  // https://github.com/bitinn/node-fetch/blob/master/rollup.config.js
  id = id.split('/').slice(0, id[0] === '@' ? 2 : 1).join('/')
  return !!require('./package.json').dependencies[id]
}
