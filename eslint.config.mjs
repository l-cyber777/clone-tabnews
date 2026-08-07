// Base recommended rules from ESLint itself
// Regras recomendadas base do próprio ESLint
import js from "@eslint/js";
// Next.js-specific rules (includes accessibility and performance/"core web vitals" checks)
// Regras específicas do Next.js (inclui checagens de acessibilidade e performance/"core web vitals")
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
// Rules and best practices for writing Jest tests
// Regras e boas práticas para escrever testes com Jest
import jest from "eslint-plugin-jest";
// Disables ESLint rules that would conflict with Prettier's formatting
// Desativa regras do ESLint que conflitariam com a formatação do Prettier
import prettier from "eslint-config-prettier";

// The array order matters: later entries can override rules from earlier ones
// A ordem do array importa: itens posteriores podem sobrescrever regras dos anteriores
const eslintConfig = [
  js.configs.recommended,
  ...nextCoreWebVitals,
  jest.configs["flat/recommended"],
  // Prettier goes last so it has the final say on formatting-related rules
  // Prettier fica por último para ter a palavra final nas regras de formatação
  prettier,
];

export default eslintConfig;
