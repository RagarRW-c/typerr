import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import globals from "globals";

export default tsEslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", "*.js"], // <--- TO WAŻNE: ignorujemy dist!
  },
  {
    rules: {
      // Opcjonalnie złagodź niektóre reguły na start, jeśli chcesz mniej błędów
      "@typescript-eslint/no-explicit-any": "warn",     // zmieniamy z error na warn
      "@typescript-eslint/no-unused-vars": "warn",     // zmieniamy na warn
      "@typescript-eslint/no-require-imports": "warn", // jeśli jeszcze używasz require
    },
  }
);