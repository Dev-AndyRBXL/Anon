export default {
  ignorePatterns: ['dist'],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react-refresh/recommended',
      ],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      env: {
        browser: true,
      },
      plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh', 'import'],
      rules: {
        'import/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                target: './src',          
                from: './src/features',  
                message:
                  'You cannot import anything from the features folder outside of it.',
              },
            ],
          },
        ],
      },
    },
  ],
};
