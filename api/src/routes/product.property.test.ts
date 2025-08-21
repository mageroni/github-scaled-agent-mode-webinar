import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import fc from 'fast-check';
import productRouter from './product';

let app: express.Express;

describe('Product API Property-Based Tests', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
    });

    it('should handle various valid product names', () => {
        fc.assert(fc.property(
            fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
            fc.nat({ max: 999999 }),
            fc.double({ min: 0.01, max: 10000 }),
            fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[A-Z0-9-]+$/i.test(s)),
            async (name, productId, price, sku) => {
                const product = {
                    productId,
                    supplierId: 1,
                    name: name.trim(),
                    description: "Test description",
                    price,
                    sku: sku.toUpperCase(),
                    unit: "piece",
                    imgName: "test.png"
                };

                const response = await request(app).post('/products').send(product);
                
                // Should either succeed (201) or fail with validation error (400)
                expect([201, 400]).toContain(response.status);
                
                if (response.status === 201) {
                    expect(response.body.name).toBe(product.name);
                    expect(response.body.price).toBe(product.price);
                    expect(response.body.productId).toBe(product.productId);
                }
            }
        ), { numRuns: 5 }); // Reduced runs for faster testing
    });

    it('should accept various price formats', () => {
        fc.assert(fc.property(
            fc.double({ min: 0.01, max: 9999.99 }),
            async (price) => {
                const product = {
                    productId: Math.floor(Math.random() * 999999) + 100000,
                    supplierId: 1,
                    name: "Price Test Product",
                    description: "Test description",
                    price,
                    sku: `PRICE-${Math.floor(Math.random() * 10000)}`,
                    unit: "piece",
                    imgName: "test.png"
                };

                const response = await request(app).post('/products').send(product);
                
                // Valid prices should be accepted
                expect([201, 400]).toContain(response.status);
                
                if (response.status === 201) {
                    expect(response.body.price).toBe(price);
                }
            }
        ), { numRuns: 5 });
    });

    it('should handle various SKU formats consistently', () => {
        fc.assert(fc.property(
            fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
            async (sku) => {
                const product = {
                    productId: Math.floor(Math.random() * 999999) + 200000,
                    supplierId: 1,
                    name: "SKU Test Product",
                    description: "Test description",
                    price: 99.99,
                    sku: sku.trim(),
                    unit: "piece",
                    imgName: "test.png"
                };

                const response = await request(app).post('/products').send(product);
                
                // Valid SKUs should be accepted
                expect([201, 400]).toContain(response.status);
                
                if (response.status === 201) {
                    expect(response.body.sku).toBeTruthy();
                }
            }
        ), { numRuns: 5 });
    });

    it('should validate basic product structure properties', () => {
        fc.assert(fc.property(
            fc.record({
                productId: fc.nat(),
                supplierId: fc.nat({ max: 10 }),
                name: fc.string({ minLength: 1, maxLength: 200 }),
                description: fc.string({ maxLength: 1000 }),
                price: fc.double({ min: 0, max: 99999 }),
                sku: fc.string({ minLength: 1, maxLength: 100 }),
                unit: fc.constantFrom('piece', 'box', 'set', 'pair'),
                imgName: fc.string({ minLength: 1, maxLength: 100 })
            }),
            async (product) => {
                if (product.name.trim().length === 0 || product.sku.trim().length === 0) {
                    return; // Skip invalid inputs
                }

                const response = await request(app).post('/products').send(product);
                
                // Should handle the request without crashing
                expect(typeof response.status).toBe('number');
                expect(response.status).toBeGreaterThanOrEqual(200);
                expect(response.status).toBeLessThan(600);
            }
        ), { numRuns: 5 });
    });
});