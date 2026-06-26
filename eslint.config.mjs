import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      sonarjs: sonarjs,
      jest: jest,
      "jest-dom": jestDom,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
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
      "sonarjs/cognitive-complexity": ["error", 50],
      // We want to use referrer
      "react/jsx-no-target-blank": 0,
      // Disable duplicate string check
      "sonarjs/no-duplicate-string": "off",
      // Allow @ts-ignore comments
      "@typescript-eslint/ban-ts-comment": "off",
      "sonarjs/no-identical-functions": "off",
    },
  },
  {
    files: ["**/reducer.ts"],
    rules: {
      "sonarjs/no-small-switch": "off",
    },
  },
  {
    ignores: [
      "build*/",
      "dist/",
      "lib/",
      "fbexport",
      ".webpack/",
      ".resources/",
      "out/",
      "node_modules/",
      ".next/",
      "packages/app/**",
      "packages/web/.next/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/.webpack/**",
      "**/build/**",
      "**/dist/**",
    ],
  },
];
