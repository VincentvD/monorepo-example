import baseConfig from '../../rollup.config'
import pkg from './package.json'

export default {
  output: [
    {
      file: `${pkg.main}`,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: `${pkg.module}`,
      format: 'es',
      sourcemap: true,
    },
  ],
  ...baseConfig,
}
