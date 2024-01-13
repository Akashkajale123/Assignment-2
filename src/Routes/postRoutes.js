const express = require('express');
const postController = require('../Controllers/postController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

router.use(authMiddleware.authenticateUser);

router.get('/posts', postController.fetchPosts);
router.post('/posts', postController.createPost);
router.put('/posts/:postId', postController.editPost);
router.delete('/posts/:postId', postController.deletePost);

module.exports = router;
