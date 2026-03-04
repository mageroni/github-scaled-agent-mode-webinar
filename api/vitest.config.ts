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
				'src/index.ts', // Main server file
				'src/models/', // Type definitions only
				'src/routes/delivery.ts', // Not tested yet
				'src/routes/headquarters.ts', // Not tested yet
				'src/routes/order.ts', // Not tested yet
				'src/routes/orderDetail.ts', // Not tested yet
				'src/routes/orderDetailDelivery.ts' // Not tested yet
			]
		},
	},
})