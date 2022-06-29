const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// update a post
router.put('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("post updated");
        }
        else {
            res.status(403).json("can only update self posts");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

// delete a post
router.delete('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post deleted");
        }
        else {
            res.status(403).json("can only delete your posts");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})

// like a post
router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("Liked the post")
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("unliked the post")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// get timeline posts
router.get('/timeline/all', async (req, res) => {
    try {
        let currentUser = null;
        try {
            currentUser = await User.findById(req.body.userId);
        }
        catch (e) {
            res.status(404).json("invalid user creds")
            return;
        }
        const userPosts = await Post.find({ userId: currentUser._id });

        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => Post.find({ userId: friendId }))
        )

        let posts = userPosts.concat(...friendPosts)
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;