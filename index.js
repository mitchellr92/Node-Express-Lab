// import your node modules

const express = require('express');
const db = require('./data/db.js');
const cors = require('cors');

const server = express();
const PORT = 4000;

// add your server code starting here

// Ednpoints

server.use(cors())
server.use(express.json())

server.get('/api/posts', (req, res) => {

    db.find()
        .then((posts) => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500)
                .json({ message: 'Failed to get posts' })

        })

});

server.get('/api/posts/:id', (req, res) => {

    const { id } = req.params;

    db.findById(id)
        .then(post => {
            if (post.length) {
                res.json(post)
            } else {
                res.status(404)
                    .json({ message: 'Failed to get post' })
            }
        })
        .catch(err => {
            res.status(500)
                .json({ message: 'Failed to get post' })
        })

})

server.post('/api/posts', (req, res) => {

    const post = req.body;

    if (post.title && post.contents) {
        db.insert(post)
            .then(idInfo => {
                db.findById(idInfo.id).then(post => {
                    res.status(201).json(idInfo)
                })
            })
            .catch(err => {
                res.status(500)
                    .json({ message: 'Failed to insert post' })
            })
    } else {
        res.status(400).json({
            message: 'missing title or content'
        })
    }
})

server.delete('/api/posts/:id', (req, res) => {

    const { id } = req.params;
    
    db.remove(id)
        .then(count => {
            if (count) {
                res.json({ message: 'successfully deleted' })
            } else {
                res.status(404)
                    .json({ message: 'invalid id' })
            }
        })
        .catch(err => {
            res.status(500)
                .json({ message: 'Failed to delete post' })
        })
})

server.put('/api/posts/:id', (req, res) => {
    
    const { id } = req.params;
    const post = req.body

    if (post.title && post.contents) {
        db.update(id, post)
            .then(count => {
                if (count) {
                    db.findById(id).then(post => {
                        res.json(post);
                    });
                } else {
                    res.status(404).json({ message: 'invalid id' });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({ message: 'Failed to update post' })
            })
    } else {
        res.status(400).json({
            message: 'missing title or content'
        })
    }
})

// Listen

server.listen(PORT)