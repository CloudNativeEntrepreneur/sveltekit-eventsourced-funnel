module.exports = {
  root: true,
  extends: ['standard', 'prettier'],
  plugins: ['svelte3'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  rules: {
    'no-async-promise-executor': 'off', // why?
    'import/first': 'off' // this doesnt play nice with .svelte files
  }
}
