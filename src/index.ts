import http from 'http'

const server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
  if (request.url === '/' && request.method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Hello!')
  }
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
