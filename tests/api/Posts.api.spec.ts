import { test, expect } from '../fixtures/CommonFixtures';
import type { CreatePostPayload, Post } from './clients/PostsApiClient';

test.describe('Posts API - create and read workflow', {
    tag: ['@api'] }, () => {
    /**
     * GIVEN a valid post payload
     * WHEN a create request is sent to POST /posts
     * THEN the API should respond with 201
     * AND the response body should reflect the data that was sent
     */
    test('POST /posts creates a resource with the expected payload echoed back', async ({
        postsApiClient,
    }) => {
        const payload: CreatePostPayload = {
            title: 'Signal Core scan request',
            body: 'Automated scan created via API test',
            userId: 1,
        };

        const response = await postsApiClient.createPost(payload);
        expect(response.status()).toBe(201);
        const created: Post = await response.json();
        expect(created).toMatchObject(payload as unknown as Record<string, unknown>);
        expect(created.id).toBeDefined();
        expect(typeof created.id).toBe('number');
    });

    /**
     * GIVEN post id 1 exists as seed data on the mock API
     * WHEN a read request is sent to GET /posts/1
     * THEN the API should respond with 200
     * AND the response fields should match what's expected for that resource
     */
    test('GET /posts/1 retrieves an existing resource and its fields are correct', async ({
        postsApiClient,
    }) => {
        const response = await postsApiClient.getPost(1);
        expect(response.status()).toBe(200);
        const post: Post = await response.json();
        expect(post.id).toBe(1);
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');
        expect(post).toHaveProperty('userId');
        expect(typeof post.title).toBe('string');
        expect(post.title.length).toBeGreaterThan(0);
    });

    /**
     * GIVEN a post id that does not exist on the mock API
     * WHEN a read request is sent to GET /posts/9999
     * THEN the API should respond with 404
     * AND the response body should be empty
     */
    test('GET /posts/9999 for a non-existent resource returns not found', async ({
        postsApiClient,
    }) => {
        const response = await postsApiClient.getPost(9999);
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(Object.keys(body).length).toBe(0);
        expect(response.headers()['content-type']).toContain('application/json')
    });
});