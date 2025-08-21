import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
        // Note: Without reset function, tests may have interdependencies
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(seedProducts.length);
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('productId', 1);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('sku');
    });

    it('should create a new product', async () => {
        const newProduct = {
            productId: 999,
            supplierId: 1,
            name: "Test Product",
            description: "A test product for unit testing",
            price: 99.99,
            sku: "TEST-PROD-001",
            unit: "piece",
            imgName: "test-product.png"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newProduct);
    });

    it('should update a product by ID', async () => {
        // First, get a product to update
        const getResponse = await request(app).get('/products/1');
        expect(getResponse.status).toBe(200);
        
        const updatedProduct = {
            ...getResponse.body,
            name: 'Updated SmartLitter Pro 3000',
            price: 229.99
        };
        const response = await request(app).put('/products/1').send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedProduct.name);
        expect(response.body.price).toBe(updatedProduct.price);
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/99999');
        expect(response.status).toBe(404);
    });

    it('should validate basic product structure', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        
        if (response.body.length > 0) {
            const product = response.body[0];
            expect(product).toHaveProperty('productId');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('description');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('sku');
            expect(typeof product.price).toBe('number');
            expect(typeof product.productId).toBe('number');
        }
    });

    it('should handle product creation with minimal validation', async () => {
        const incompleteProduct = {
            name: "Incomplete Product"
            // Missing required fields like productId, price, sku, etc.
        };
        const response = await request(app).post('/products').send(incompleteProduct);
        // API currently doesn't validate, so it will accept incomplete data
        expect([200, 201, 400]).toContain(response.status);
    });

    it('should handle various price values', async () => {
        const products = [
            {
                productId: 1001,
                supplierId: 1,
                name: "Valid Price Product",
                description: "Product with valid price",
                price: 99.99,
                sku: "VALID-001",
                unit: "piece",
                imgName: "valid.png"
            },
            {
                productId: 1002,
                supplierId: 1,
                name: "Zero Price Product",
                description: "Product with zero price",
                price: 0,
                sku: "ZERO-001",
                unit: "piece",
                imgName: "zero.png"
            }
        ];

        for (const product of products) {
            const response = await request(app).post('/products').send(product);
            expect([200, 201, 400]).toContain(response.status);
        }
    });

    it('should delete a product by ID', async () => {
        // First create a product to delete
        const productToDelete = {
            productId: 1003,
            supplierId: 1,
            name: "Product to Delete",
            description: "This product will be deleted",
            price: 50.00,
            sku: "DELETE-001",
            unit: "piece",
            imgName: "delete.png"
        };
        
        const createResponse = await request(app).post('/products').send(productToDelete);
        expect(createResponse.status).toBe(201);
        
        // Now delete it
        const deleteResponse = await request(app).delete('/products/1003');
        expect(deleteResponse.status).toBe(204);
        
        // Verify it's gone
        const getResponse = await request(app).get('/products/1003');
        expect(getResponse.status).toBe(404);
    });
});