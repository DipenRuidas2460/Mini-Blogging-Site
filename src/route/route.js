const express = require('express');
const router = express.Router();
const blogController = require("../controllers/blogController")
const authorController = require("../controllers/authorController")
const middleware = require("../middleware/auth")

router.post("/authors", authorController.createAuthor)
router.post("/login", authorController.loginAuthor)
router.post("/blogs", middleware.authenticate, blogController.createBlog)
router.get("/blogs", middleware.authenticate, blogController.getBlogs)
router.put("/blogs/:blogId", middleware.authenticate, middleware.authorize, blogController.updateBlog)
router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorize, blogController.deleteBlog)
router.delete("/blogs", middleware.authenticate, middleware.authorize, blogController.deleteBlogByQuery)

module.exports = router