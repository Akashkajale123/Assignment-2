const Post = require('../model/Post.js');
const User = require('../model/User.js');

exports.fetchPosts = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.find().populate('user', 'name email');

    return res.status(200).json({ status: 'success', posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const userId = req.user.userId; // Extracted from JWT token in authMiddleware

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'User not authorized' });
    }

    // Create a new post
    const newPost = new Post({ title, body, image, user: userId });
    await newPost.save();

    return res.status(201).json({ status: 'success', message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const postId = req.params.postId;
    const userId = req.user.userId; // Extracted from JWT token in authMiddleware

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    // Check if the user is authorized to edit the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to edit this post' });
    }

    // Update the post
    post.title = title || post.title;
    post.body = body || post.body;
    post.image = image || post.image;
    await post.save();

    return res.status(200).json({ status: 'success', message: 'Post updated successfully', post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId; // Extracted from JWT token in authMiddleware

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ status: 'error', message: 'Post not found' });
    }

    // Check if the user is authorized to delete the post
    if (post.user.toString() !== userId) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this post' });
    }

    // Delete the post
    await post.deleteOne({ _id: postId }); // Use deleteOne method

    return res.status(200).json({status:'Successfully deleted', message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};
