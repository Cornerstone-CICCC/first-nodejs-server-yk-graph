"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer((request, response) => {
    if (request.url === '/' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Hello!');
    }
});
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
//# sourceMappingURL=index.js.map