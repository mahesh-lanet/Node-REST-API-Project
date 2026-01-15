const fs = require("fs");
const path = require("path");

const { check, validationResult } = require("express-validator");
const Post = require("../models/post");

//GET ALL POST
exports.getPost = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({
        message: "Posts Fetched successfully",
        posts: posts,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//CREATE POST
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Entered data is Incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 442;
    throw error;
  }

  const image = req.file;
  const imagesUrl = image.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = Post({
    title: title,
    content: content,
    imageUrl: imagesUrl,
    creator: {
      name: "MK",
    },
  });

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post Create Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//GET POST BY ID
exports.getPostById = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched by Id", post: post });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// UPDATE POST BY ID
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    imageUrl = req.file.path;
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed, Entered data is Incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 442;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post Update Successfully",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//DELETE POST BY ID
exports.deletPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post..");
        error.statusCode = 404;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.deleteOne({ _id: postId });
    })
    .then((result) => {
      res.status(200).json({ message: "Post Delete Successfully!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
