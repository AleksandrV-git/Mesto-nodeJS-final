/* eslint-disable quote-props */
/* eslint-disable quotes */
module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "rules": {
    "object-curly-newline": ["error", { "consistent": true }],
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
    "linebreak-style": [ // Применять согласованный стиль переноса строки
      "error",
      "unix",
    ],
  },
};
