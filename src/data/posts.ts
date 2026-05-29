import { Post } from '../types/post'

const store: { posts: Post[] } = {
  posts: [
    { id: 1, title: 'First Post', body: 'This is the first post.', userId: 1 },
    { id: 2, title: 'Second Post', body: 'This is the second post.', userId: 1 },
  ],
}

export default store
