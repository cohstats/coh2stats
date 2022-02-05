module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["sonarjs", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:sonarjs/recommended",
    "plugin:jest/recommended",
    "plugin:jest-dom/recommended",
  ],
  rules: {
    // We shouldn't really use ANY but we can't have everything perfect
    "@typescript-eslint/no-explicit-any": "off",
    // We kinda need interface not type
    "@typescript-eslint/no-empty-interface": "off",
    // We are OK with disabled tests
    "jest/no-disabled-tests": "off",
    // In fact we are OK with == instead of === as we aren't sure if
    // data type in API is number/string. It really doesn't matter;
    eqeqeq: "off",
    "jest/expect-expect": "off",
    "sonarjs/cognitive-complexity": ["error", 25],
  },
  overrides: [
    // We want always switch in Reducers
    {
      files: ["**/reducer.ts"],
      rules: {
        "sonarjs/no-small-switch": "off",
      },
    },
  ],
};
