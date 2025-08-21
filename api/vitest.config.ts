/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: false,
		environment: 'node',
		coverage: {
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 70,
				functions: 70,
				branches: 70,
				statements: 70
			},
			exclude: [
				'node_modules/',
				'src/test/',
				'**/*.d.ts',
				'**/*.config.*',
				'dist/',
				'src/index.ts' // Main server file
			]
		},
	},
})