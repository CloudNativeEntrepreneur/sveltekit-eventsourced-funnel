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
  globals: {
    gql: true,
    ga: true,
    describe: true,
    it: true,
    test: true,
    expect: true,
    jest: true,
    beforeEach: true,
    afterEach: true,
    jasmine: true,
    beforeAll: true,
    afterAll: true
  },
  rules: {
    'import/first': 'off' // this doesnt play nice with .svelte files
  }
}
