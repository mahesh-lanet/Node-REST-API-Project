const express = require("express");

const feedController = require("../controllers/feed");

const router = express();

// GET  /feed
router.get("/posts", feedController.getPost);

//POST /feed/post
router.post("/post", feedController.postPost);

module.exports = router;
