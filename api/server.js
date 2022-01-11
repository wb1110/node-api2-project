// implement your server here
// require your posts router and connect it here
const express = require('express')
const server = express()
server.use(express.json())
const Posts = require('./posts/posts-model')

// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database                                                          |
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id                                  |

server.get('/api/posts', (req, res) => {
    Posts.find()
    .then ((posts) => {
        res.status(200).json(posts)
    })
    .catch (err => {
        console.log(err)
    })
})

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params
    Posts.findById(id)
    .then ((post) => {
        res.status(200).json(post)
    })
    .catch (err => {
        console.log(err)
    })
})

server.post('/api/posts', (req, res) => {
    const post = req.body
    Posts.insert(post)
    .then ((newPost) => {
        res.status(201).json(newPost)
    })
    .catch (err => {
        console.log(err)
    })
})

server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params
    const post = req.body
    Posts.update(id, post)
    .then ((updatedPost) => {
        res.status(200).json(updatedPost)
    })
    .catch (err => {
        console.log(err)
    })
})

server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params
    Posts.remove(id)
    .then ((deletedPost) => {
        res.status(204).json(deletedPost)
    })
    .catch (err => {
        console.log(err)
    })
})

server.get('/api/posts/:id/comments', (req, res) => {
    const { id } = req.params
    Posts.findPostComments(id)
    .then ((postComments) => {
        res.status(200).json(postComments)
    })
    .catch (err => {
        console.log(err)
    })
})

module.exports = server