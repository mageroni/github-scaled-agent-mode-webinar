import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import supplierRouter from './supplier';

let app: express.Express;

describe('Supplier API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/suppliers', supplierRouter);
    });

    it('should get all suppliers', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a supplier by ID', async () => {
        const response = await request(app).get('/suppliers/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('supplierId', 1);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('contactPerson');
        expect(response.body).toHaveProperty('email');
    });

    it('should create a new supplier', async () => {
        const newSupplier = {
            supplierId: 4,
            name: "Test Supplier Corp",
            description: "A test supplier for unit testing",
            contactPerson: "John Test",
            email: "john@testsupplier.com",
            phone: "555-TEST"
        };
        const response = await request(app).post('/suppliers').send(newSupplier);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(newSupplier);
    });

    it('should update a supplier by ID', async () => {
        // First, get a supplier to update
        const getResponse = await request(app).get('/suppliers/1');
        expect(getResponse.status).toBe(200);
        
        const updatedSupplier = {
            ...getResponse.body,
            name: 'Updated PurrTech Innovations',
            email: 'updated@purrtech.co'
        };
        const response = await request(app).put('/suppliers/1').send(updatedSupplier);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedSupplier.name);
        expect(response.body.email).toBe(updatedSupplier.email);
    });

    it('should return 404 for non-existing supplier', async () => {
        const response = await request(app).get('/suppliers/999');
        expect(response.status).toBe(404);
    });

    it('should delete a supplier by ID', async () => {
        // First create a supplier to delete
        const supplierToDelete = {
            supplierId: 5,
            name: "Supplier to Delete",
            description: "This supplier will be deleted",
            contactPerson: "Delete Test",
            email: "delete@test.com",
            phone: "555-DELETE"
        };
        
        const createResponse = await request(app).post('/suppliers').send(supplierToDelete);
        expect(createResponse.status).toBe(201);
        
        // Now delete it
        const deleteResponse = await request(app).delete('/suppliers/5');
        expect(deleteResponse.status).toBe(204);
        
        // Verify it's gone
        const getResponse = await request(app).get('/suppliers/5');
        expect(getResponse.status).toBe(404);
    });

    it('should validate supplier structure', async () => {
        const response = await request(app).get('/suppliers');
        expect(response.status).toBe(200);
        
        if (response.body.length > 0) {
            const supplier = response.body[0];
            expect(supplier).toHaveProperty('supplierId');
            expect(supplier).toHaveProperty('name');
            expect(supplier).toHaveProperty('description');
            expect(supplier).toHaveProperty('contactPerson');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('phone');
            expect(typeof supplier.supplierId).toBe('number');
            expect(typeof supplier.name).toBe('string');
        }
    });
});