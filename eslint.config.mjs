import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  js.configs.recommended,
  ...nextCoreWebVitals,
  jest.configs["flat/recommended"],
  prettier,
];

export default eslintConfig;
