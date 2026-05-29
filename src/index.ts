import http from 'http'
import store from './data/posts'
import { Post } from './types/post'

const getBody = (request: http.IncomingMessage): Promise<Post> => {
  return new Promise((resolve) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk.toString()
    })
    request.on('end', () => {
      resolve(JSON.parse(body))
    })
  })
}

const server = http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
  const url = request.url || '/'
  const method = request.method || 'GET'
  const postMatch = url.match(/^\/posts\/(\d+)$/)

  // GET /posts
  if (url === '/posts' && method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(store.posts))
    return
  }

  // GET /posts/:id
  if (postMatch && method === 'GET') {
    const id = parseInt(postMatch[1])
    const post = store.posts.find((p) => p.id === id)
    if (post) {
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(post))
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Post not found' }))
    }
    return
  }

  // POST /posts
  if (url === '/posts' && method === 'POST') {
    const data = await getBody(request)
    const nextId = store.posts.reduce((maxId, post) => Math.max(maxId, post.id), 0) + 1
    const newPost: Post = { ...data, id: nextId }
    store.posts.push(newPost)
    response.writeHead(201, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(newPost))
    return
  }

  // PUT /posts/:id
  if (postMatch && method === 'PUT') {
    const id = parseInt(postMatch[1])
    const data = await getBody(request)
    const index = store.posts.findIndex((p) => p.id === id)
    if (index !== -1) {
      store.posts[index] = { ...data, id }
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(store.posts[index]))
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Post not found' }))
    }
    return
  }

  // PATCH /posts/:id
  if (postMatch && method === 'PATCH') {
    const id = parseInt(postMatch[1])
    const data = await getBody(request)
    const index = store.posts.findIndex((p) => p.id === id)
    if (index !== -1) {
      store.posts[index] = { ...store.posts[index], ...data }
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(store.posts[index]))
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Post not found' }))
    }
    return
  }

  // DELETE /posts/:id
  if (postMatch && method === 'DELETE') {
    const id = parseInt(postMatch[1])
    const index = store.posts.findIndex((p) => p.id === id)
    if (index !== -1) {
      const deleted = store.posts.splice(index, 1)[0]
      response.writeHead(200, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify(deleted))
    } else {
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.end(JSON.stringify({ error: 'Post not found' }))
    }
    return
  }

  // GET /health
  if (url === '/health' && method === 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'ok' }))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
