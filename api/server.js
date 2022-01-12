// implement your server here
// require your posts router and connect it here
const express = require('express')
const server = express()
server.use(express.json())
const router = require("./posts/posts-router")

server.use("/api/posts", router)

module.exports = server