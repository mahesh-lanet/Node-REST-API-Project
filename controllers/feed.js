exports.getPost = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post content" }],
  });
};

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post Create Successfully",
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
