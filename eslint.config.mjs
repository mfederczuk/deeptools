// SPDX-License-Identifier: CC0-1.0

import eslintJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from "eslint/config";
import typescriptEslint from "typescript-eslint";

const ERROR = "error";
const OFF = "off";

const createConfig = (filesRootDir, tsconfigRootDir) => {
	return {
		files: [`${filesRootDir}/**/*.{ts,js,mjs}`],

		languageOptions: {
			ecmaVersion: 2015,

			parserOptions: {
				projectService: true,
				tsconfigRootDir: tsconfigRootDir,
			},
		},

		extends: [
			eslintJs.configs.recommended,
			...typescriptEslint.configs.recommendedTypeChecked,
			...typescriptEslint.configs.strictTypeChecked,
			...typescriptEslint.configs.stylisticTypeChecked,
			stylistic.configs.customize({
				indent: "tab",
				quotes: "double",
				semi: true,
				arrowParens: true,
			}),
		],

		rules: {
			"@stylistic/brace-style": [ERROR, "1tbs"],
			"@stylistic/indent-binary-ops": OFF,
			"@stylistic/no-extra-semi": ERROR,
			"@stylistic/no-mixed-spaces-and-tabs": [ERROR, "smart-tabs"],
			"@stylistic/no-multiple-empty-lines": [ERROR, { max: 2 }],
			"@stylistic/operator-linebreak": [ERROR, "after"],
			"@stylistic/padded-blocks": [ERROR, { classes: "start" }],
			"@stylistic/spaced-comment": [ERROR, "always", { line: { markers: ["#region", "#endregion"] } }],
			"@typescript-eslint/explicit-function-return-type": ERROR,
			"@typescript-eslint/explicit-member-accessibility": ERROR,
			"@typescript-eslint/explicit-module-boundary-types": ERROR,
			"@typescript-eslint/naming-convention": ERROR,
			"@typescript-eslint/no-inferrable-types": OFF,
			"@typescript-eslint/strict-boolean-expressions": ERROR,
			"curly": ERROR,
			"eqeqeq": ERROR,
			"no-constant-condition": OFF, // Covered by @typescript-eslint/no-unnecessary-condition
			"no-inner-declarations": ERROR,
		},
	};
};

const rootDir = import.meta.dirname;

export default defineConfig([
	createConfig("src", rootDir),
	createConfig("test", `${rootDir}/test`),
]);
