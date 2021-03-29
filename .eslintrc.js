module.exports = {
  'env': {
    'commonjs': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'parserOptions': {
    'ecmaVersion': 12,
  },
  'rules': {
    'babel/new-cap': 0,
    'new-cap': [0, {'newIsCap': false, 'capIsNew': false}],
    'no-console': 'off',
    'quotes': [
      'error',
      'single',
    ],
    'indent': ['error', 2],
    // we want to avoid useless spaces
    'no-multi-spaces': ['error'],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
  },
};
