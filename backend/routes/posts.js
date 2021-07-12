const express = require('express');

const postController = require("../controllers/posts");
const checkAuth = require('../middleware/check_auth');
const fileExtractor = require('../middleware/file-extractor');

const router = express.Router();


router.post('/post', checkAuth, fileExtractor, postController.createPost);

router.get("/post/:id", postController.getPost)

router.get('/posts', postController.getPosts);

router.put("/post/:id", checkAuth, fileExtractor, postController.updatePost);

router.delete('/post/:id', checkAuth, postController.deletePost);


module.exports = router;
