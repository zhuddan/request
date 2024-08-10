import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'src/ignore.js',
    ],
  },
)
