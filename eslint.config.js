import js from "@eslint/js";
import globals from "globals";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import jsdocPlugin from "eslint-plugin-jsdoc";
import reactPlugin from "eslint-plugin-react";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import sonarjsPlugin from "eslint-plugin-sonarjs";

export default defineConfig([
  globalIgnores([
    "dist",
    "__generated__/**",
    "**/*.test.*",
    "src/libs/utils/**",
    "src/libs/unit-test/**",
    "src/libs/utils.ts",
    "src/modules/case-management/**",
    "src/modules/corporate/**",
    "src/modules/digital-care/**",
    "src/types/react-table.d.ts",
    "src/modules/information-inquiry/**",
    "src/modules/user-management/**",
    "src/modules/claim-management/**",
    "src/modules/e-nota/**",
    "src/components/Feature/CaseManagement/**",
    "src/components/Feature/ClaimEntryCorporateDetail/**",
    "src/components/Feature/ClaimEntryDetail/**",
    "src/modules/case-management-revamp/case-admin/workflow-filter/custom/**",
    "src/components/ClientTable/ClientTable.tsx",
    "src/components/ClientTable/index.ts",
    "src/components/ServerTable/ServerTable.tsx",
    "src/components/ServerTable/index.ts",
    "src/modules/dukcapil-checking/components/FormChecking/schema.ts",
    "src/modules/dukcapil-checking/components/FormChecking/index.tsx",
  ]),

  // Base config for all ts/tsx files
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      jsdoc: jsdocPlugin,
      react: reactPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "unused-imports": unusedImportsPlugin,
      sonarjs: sonarjsPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
      },
      parserOptions: {
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      ...sonarjsPlugin.configs.recommended?.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Inherited from old project base rules
      "no-unused-vars": "off",
      "no-console": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "simple-import-sort/exports": "warn",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^@?\\w", "^\\u0000"],
            ["^.+\\.s?css$"],
            ["^@/libs"],
            ["^@/hooks"],
            ["^@/data"],
            ["^@/components", "^@/container"],
            ["^@/assets"],
            ["^@/configs"],
            ["^@/redux"],
            ["^@/"],
            [
              "^\\./?$",
              "^\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\.\\.(?!/?$)",
              "^\\.\\./\\.\\./?$",
              "^\\.\\./\\.\\.(?!/?$)",
              "^\\.\\./\\.\\./\\.\\./?$",
              "^\\.\\./\\.\\./\\.\\.(?!/?$)",
            ],
            ["^@/constants"],
            ["^@/types"],
            ["^"],
          ],
        },
      ],
      "react-hooks/exhaustive-deps": "off",
    },
  },

  // Specific overrides mimicking the old project
  {
    files: [
      "**/*.component.{ts,tsx}",
      "**/*.container.{ts,tsx}",
      "**/*.wrapper.{ts,tsx}",
      "**/*.config.{ts,tsx}",
      "**/*.hook.ts",
      "**/*.hooks.ts",
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSTypeAliasDeclaration",
          message:
            "Type alias declaration is not allowed. Move it to a .type file.",
        },
        {
          selector: "TSInterfaceDeclaration",
          message:
            "Interface declaration is not allowed. Move it to a .type file.",
        },
      ],
    },
  },

  // Strict rules for specific modules
  {
    files: [
      "src/app/order/**/*.{ts,tsx}",
      "src/app/dashboard/**/*.{ts,tsx}",
      "src/modules/dashboard/**/*.{ts,tsx}",
      "src/modules/order/**/*.{ts,tsx}",
    ],
    rules: {
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-var": "error",
      "func-style": ["error", "expression"],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          filter: { regex: "^_", match: true },
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
        {
          selector: "variable",
          modifiers: ["const"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        { selector: "function", format: ["camelCase"] },
        {
          selector: "function",
          modifiers: ["exported"],
          format: ["camelCase", "PascalCase"],
        },
        { selector: "typeLike", format: ["PascalCase"] },
      ],
      "require-await": "error",
      "@typescript-eslint/no-restricted-types": [
        "error",
        {
          types: {
            object: {
              message:
                "Use a specific object shape instead. Define a proper type with explicit properties (e.g., { key: string; value: number }).",
            },
            unknown: {
              message:
                "Use a specific type instead of 'unknown'. Consider using a union, mapped type, or generic constraint.",
            },
          },
        },
      ],
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next", "^@?\\w"],
            ["^@/libs", "^@/utils"],
            ["^@/hooks"],
            ["^@/components", "^@/container"],
            ["^@/constants", "^@/types"],
            ["^@/fixture", "^@/assets"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          ],
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: "*",
          next: ["if", "for", "while", "switch", "try"],
        },
        {
          blankLine: "always",
          prev: ["if", "for", "while", "switch", "try"],
          next: "*",
        },
        { blankLine: "always", prev: "*", next: ["function", "class"] },
        { blankLine: "always", prev: ["function", "class"], next: "*" },
      ],
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message:
            "Direct fetch is prohibited. Use RTK Query or Axios-based ApiClient.",
        },
        {
          selector: "JSXExpressionContainer > ArrowFunctionExpression",
          message:
            "No inline arrow function in JSX event handlers. Pass the function reference directly.",
        },
        {
          selector: "Property[key.name=/^on[A-Z]/] > ArrowFunctionExpression",
          message:
            "No inline arrow function in event handler properties. Pass the function reference directly.",
        },
        {
          selector: "TSTypeAliasDeclaration",
          message:
            "Type alias declaration is not allowed. Move it to a .type / .types file.",
        },
        {
          selector: "TSInterfaceDeclaration",
          message:
            "Interface declaration is not allowed. Move it to a .type / .types file.",
        },
        {
          selector: "TSTypeReference[typeName.name='Record'] TSUnknownKeyword",
          message:
            "Avoid 'Record<string, unknown>'. Define a proper interface or type with explicit properties.",
        },
        {
          selector: "TSTypeReference[typeName.name='Record'] TSAnyKeyword",
          message:
            "Avoid 'Record<string, any>'. Define a proper interface or type with explicit properties.",
        },
        {
          selector: "TSIndexSignature TSAnyKeyword",
          message:
            "Avoid index signatures returning 'any'. Use a concrete type instead.",
        },
        {
          selector: "TSArrayType TSAnyKeyword",
          message:
            "Avoid 'any[]'. Define a typed array (e.g., string[], number[]).",
        },
        {
          selector: "TSTypeReference[typeName.name='Array'] TSAnyKeyword",
          message:
            "Avoid 'Array<any>'. Define a typed array (e.g., string[], number[]).",
        },
      ],
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: true,
            FunctionExpression: true,
          },
        },
      ],
      "jsdoc/require-param": ["error", { checkDestructured: false }],
      "jsdoc/require-param-type": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-type": "error",
      "jsdoc/require-returns-description": "error",
      "max-lines-per-function": [
        "error",
        { max: 35, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["error", 4],
      "max-params": ["error", 4],
    },
  },

  // Strictly no hooks in components
  {
    files: ["**/*.component.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name=/^use(State|Effect|Callback|Memo|Ref|Reducer|Context|LayoutEffect|ImperativeHandle|DebugValue|DeferredValue|Transition|Id)$/]",
          message:
            "React hooks are not allowed in .component.tsx. Move hook usage to .hook.ts, .container.tsx, or .wrapper.tsx.",
        },
        {
          selector: "TSTypeAliasDeclaration",
          message:
            "Type alias declaration is not allowed. Move it to a .type / .types file.",
        },
        {
          selector: "TSInterfaceDeclaration",
          message:
            "Interface declaration is not allowed. Move it to a .type / .types file.",
        },
      ],
    },
  },

  // Relaxed rules for types files
  {
    files: ["**/*.type.ts", "**/*.types.ts"],
    rules: {
      "func-style": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "require-await": "off",
      "padding-line-between-statements": "off",
      "no-restricted-syntax": "off",
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-param-description": "off",
      "jsdoc/check-param-names": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-returns-description": "off",
      "max-lines-per-function": "off",
      "max-depth": "off",
      "max-params": "off",
    },
  },
]);
