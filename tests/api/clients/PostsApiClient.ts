import type { APIRequestContext } from '@playwright/test';

export interface CreatePostPayload {
    title: string;
    body: string;
    userId: number;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}


export class PostsApiClient {
    constructor(private readonly request: APIRequestContext) { }

    async createPost(payload: CreatePostPayload) {
        return this.request.post('/posts', { data: payload });
    }

    async getPost(id: number) {
        return this.request.get(`/posts/${id}`);
    }
}