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
        res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params
    Posts.findById(id)
    .then ((post) => {
        post ? res.status(200).json(post) : res.status(404).json({ message: "The post with the specified ID does not exist" })
    })
    .catch (err => {
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

server.post('/api/posts', (req, res) => {
    const { title, contents } = req.body
    if ( !title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Posts.insert(req.body)
        .then (({ id }) => {
            return Posts.findById(id)
        })
        .then ((post) => {
            res.status(201).json(post)
        })
        .catch (err => {
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
    }
    
})

server.put('/api/posts/:id', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        Posts.findById(req.params.id)
        .then(stuff => {
            if (!stuff) {
                res.status(404).json({ 
                    message: "The post with the specified ID does not exist",
                }) 
            } else { 
                return Posts.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if (data) {
                return Posts.findById(req.params.id)
            }
        })
        .then(post => {
            if (post) {
                res.json(post)
            }
        })
        .catch (err => {
            res.status(500).json({ message: "The post information could not be modified" })
        })
        

    }
    
})

server.delete('/api/posts/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist',
            })
        } else {
            await Posts.remove(req.params.id)
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({
            message: "the post could not be removed"
        })
    }
})

server.get('/api/posts/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist',
            })
        } else {
            const comments = await Posts.findPostComments(req.params.id)
            res.json(comments)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved"
        })
    }
})

module.exports = server