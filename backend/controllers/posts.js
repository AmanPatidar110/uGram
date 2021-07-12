const Post = require('../models/post');

exports.createPost =  (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  console.log(req.userData);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save()
    .then((createdPost) => {
      console.log(createdPost);
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
          creator: createdPost.creator
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Creating a post is failed"
      })
    });
};


exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  })
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let postsData;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery.find()
    .then(data => {
      postsData = data;
      return Post.countDocuments();
    })
    .then(postCount => {
      res.status(200).json({
        message: "All the posts are successfully fetched!",
        posts: postsData,
        maxPostCount: postCount
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
};

exports.updatePost =  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Update successfull."
        });
      } else {
        res.status(401).json({
          message: "Not Authorized!"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't update post"
      })
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Update successfull."
        });
      } else {
        res.status(401).json({
          message: "Not Authorized!"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Fetching posts failed!"
      })
    });
};



