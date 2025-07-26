import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
   baseDirectory: __dirname,
});

const eslintConfig = [
   ...compat.extends("next/core-web-vitals", "next/typescript"),
   {
      rules: {
         // TypeScript rules
         "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_" },
         ],
         "@typescript-eslint/no-unused-expressions": "off",
         "@typescript-eslint/no-explicit-any": "warn",
         "@typescript-eslint/no-empty-object-type": "off",
         "@typescript-eslint/prefer-const": "error",
         "@typescript-eslint/no-var-requires": "error",

         // React rules
         "react/prop-types": "off",
         "react/react-in-jsx-scope": "off",
         "react/display-name": "warn",
         "react-hooks/rules-of-hooks": "error",
         "react-hooks/exhaustive-deps": "warn",

         // General rules
         "no-console": ["warn", { allow: ["warn", "error"] }],
         "no-debugger": "error",
         "prefer-const": "error",
         "no-var": "error",

         // Import rules
         "import/order": [
            "error",
            {
               "groups": [
                  "builtin",
                  "external",
                  "internal",
                  "parent",
                  "sibling",
                  "index",
               ],
               "newlines-between": "always",
               "alphabetize": {
                  order: "asc",
                  caseInsensitive: true,
               },
            },
         ],
      },
   },
];

export default eslintConfig;
