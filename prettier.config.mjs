/** @type {import("prettier").Config} */
const config = {
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	arrowParens: "always",
	plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
