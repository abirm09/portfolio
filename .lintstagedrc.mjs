import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => `"${relative(process.cwd(), f)}"`).join(" ")}`;

const buildPrettierCommand = (filenames) =>
  `prettier --write ${filenames.map((f) => `"${relative(process.cwd(), f)}"`).join(" ")}`;

const config = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, buildPrettierCommand],
  "*.{json,css,scss,md,yml,yaml}": [buildPrettierCommand],
};

export default config;
