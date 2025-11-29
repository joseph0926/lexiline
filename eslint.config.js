import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores(["**/node_modules", "**/dist", "apps/web/.vite", "apps/server/prisma.config.ts"]),

	{
		files: ["apps/web/**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname + "/apps/web",
			},
		},
	},
	{
		files: ["apps/server/**/*.ts"],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.node,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname + "/apps/server",
			},
		},
	},
	{
		files: ["*.{js,ts}"],
		extends: [js.configs.recommended],
		languageOptions: {
			ecmaVersion: 2022,
			globals: globals.node,
		},
	},
]);
