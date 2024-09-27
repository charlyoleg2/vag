// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
	{
		ignores: ['dist/', 'output/', 'build/', 'node_modules/', 'template/', 'tmp/', 'tmp2/']
	},
	eslint.configs.recommended,
	//...tseslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	prettier
);
