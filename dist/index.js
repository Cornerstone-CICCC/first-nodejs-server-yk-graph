"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const posts_1 = __importDefault(require("./data/posts"));
const getBody = (request) => {
    return new Promise((resolve) => {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString();
        });
        request.on('end', () => {
            resolve(JSON.parse(body));
        });
    });
};
const server = http_1.default.createServer(async (request, response) => {
    const url = request.url || '/';
    const method = request.method || 'GET';
    const postMatch = url.match(/^\/posts\/(\d+)$/);
    // GET /posts
    if (url === '/posts' && method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(posts_1.default.posts));
        return;
    }
    // GET /posts/:id
    if (postMatch && method === 'GET') {
        const id = parseInt(postMatch[1]);
        const post = posts_1.default.posts.find((p) => p.id === id);
        if (post) {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(post));
        }
        else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Post not found' }));
        }
        return;
    }
    // POST /posts
    if (url === '/posts' && method === 'POST') {
        const data = await getBody(request);
        const nextId = posts_1.default.posts.reduce((maxId, post) => Math.max(maxId, post.id), 0) + 1;
        const newPost = { ...data, id: nextId };
        posts_1.default.posts.push(newPost);
        response.writeHead(201, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(newPost));
        return;
    }
    // PUT /posts/:id
    if (postMatch && method === 'PUT') {
        const id = parseInt(postMatch[1]);
        const data = await getBody(request);
        const index = posts_1.default.posts.findIndex((p) => p.id === id);
        if (index !== -1) {
            posts_1.default.posts[index] = { ...data, id };
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(posts_1.default.posts[index]));
        }
        else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Post not found' }));
        }
        return;
    }
    // PATCH /posts/:id
    if (postMatch && method === 'PATCH') {
        const id = parseInt(postMatch[1]);
        const data = await getBody(request);
        const index = posts_1.default.posts.findIndex((p) => p.id === id);
        if (index !== -1) {
            posts_1.default.posts[index] = { ...posts_1.default.posts[index], ...data };
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(posts_1.default.posts[index]));
        }
        else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Post not found' }));
        }
        return;
    }
    // DELETE /posts/:id
    if (postMatch && method === 'DELETE') {
        const id = parseInt(postMatch[1]);
        const index = posts_1.default.posts.findIndex((p) => p.id === id);
        if (index !== -1) {
            const deleted = posts_1.default.posts.splice(index, 1)[0];
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(deleted));
        }
        else {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Post not found' }));
        }
        return;
    }
    // GET /health
    if (url === '/health' && method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'ok' }));
        return;
    }
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not found' }));
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
//# sourceMappingURL=index.js.map