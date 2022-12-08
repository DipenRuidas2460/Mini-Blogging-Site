const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");

const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    if (Object.keys(blog).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "data can't be empty" });
    }

    if (!blog.body)
      return res
        .status(400)
        .send({ status: false, msg: "Please include an body" });
    if (!blog.authorId)
      return res
        .status(400)
        .send({ status: false, msg: "Please include an authorId" });
    if (!blog.title)
      return res
        .status(400)
        .send({ status: false, msg: "Please include a title" });
    if (!blog.category)
      return res
        .status(400)
        .send({ status: false, msg: "Please include an category" });

    if (blog.tags.length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please include some tags" });
    }

    if (blog.subcategory.length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please include some Subcatagory" });
    }

    if (!mongoose.isValidObjectId(blog.authorId))
      return res.status(400).send({ msg: "Invalid author Id" });

    let blogData = await authorModel.findById(blog.authorId);

    if (!blogData) {
      return res
        .status(400)
        .send({ status: false, msg: "Please use right author id" });
    }
    if (blog.isPublished == true) {
      blog.publishedAt = Date.now();
      let blogCreated = await blogModel.create(blog);
      return res.status(201).send({
        status: true,
        msg: "data created successfully",
        data: blogCreated,
      });
    }
    let blogCreated = await blogModel.create(blog);
    return res.status(201).send({
      status: true,
      msg: "data created successfully",
      data: blogCreated,
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getBlogs = async function (req, res) {
  try {
    let filterResult = req.query;
    //console.log(filterResult)
    if (Object.keys(filterResult).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please include some filter parameter" });
    }
    if (
      filterResult.authorId ||
      filterResult.category ||
      filterResult.tags ||
      filterResult.subcategory
    ) {
      //filterResult, {isDeleted: false}, {isPublished: true}).populate("authorId"

      let data = await blogModel.find({
        $and: [filterResult, { isDeleted: false }, { isPublished: true }],
      });

      if (data.length == 0) {
        return res.status(404).send({ status: false, msg: "Data not found" });
      }
      return res.status(200).send({ status: true, Data: data });
    } else
      res.status(404).send({
        status: false,
        msg: "Please include correct filter parameter",
      });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

//Updating the blog ->

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    if (Object.keys(data).length == 0)
      return res.status(404).send({
        status: false,
        msg: "Please include some properties to be updated",
      });
    let blog = await blogModel.findOne({ _id: blogId });
    if (Object.keys(blog).length == 0) {
      return res
        .status(404)
        .send({ status: false, error: "No such blog found" });
    }

    let arr1 = data.tags;
    for (let i = 0; i < arr1.length; i++) {
      blog.tags.push(arr1[i]);
    }
    let arr = data.subcategory;
    for (let i = 0; i < arr.length; i++) {
      blog.subcategory.push(arr[i]);
    }

    blog.isPublished = data.isPublished || true;
    blog.publishedAt = Date.now();
    let updateData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isPublished: data.isPublished },
      { new: true }
    );
    return res.status(200).send({ status: true, Data: updateData });
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

//Deleting the blog via params ->

const deleteBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    //console.log(blogId)
    if (!blogId)
      res.status(400).send({ status: false, msg: "Please include an blogId" });
    let blog = await blogModel.findById(blogId);
    if (!blog)
      return res.status(404).send({ status: false, msg: "BLOG NOT FOUND" });
    if (blog.isDeleted == true) {
      return res
        .status(400)
        .send({ status: false, msg: "This data is already deleted" });
    }
    let newData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true } },
      { deletedAt: Date.now() },
      { new: true }
    );
    return res.status(200).send({ status: true });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "ERROR", error: err.message });
  }
};

//deleting blog via query ==>

const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "no parameter provided for deleting" });
    }

    if (data.tags) {
      data.tags = {
        $in: data.tags,
      };
    }

    if (data.subcategory) {
      data.subcategory = {
        $in: data.subcategory,
      };
    }
    if (
      data.authorId ||
      data.subcategory ||
      data.category ||
      data.tags ||
      data.isPublished
    ) {
      let newData = await blogModel.findOne({
        $and: [data, { isDeleted: false }, { isPublished: false }],
      });

      if (newData == null)
        return res
          .status(404)
          .send({ status: false, msg: "Data already deleted" });

      if (newData.isDeleted == false) {
        const deletedData = await blogModel
          .findByIdAndUpdate(
            newData._id,
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true }
          )
          .select({ isDeleted: 1, deletedAt: 1, _id: 0 });
        return res.status(200).send({ status: true, msg: deletedData });
      }
    } else {
      return res.status(400).send({
        status: false,
        msg: "Parameters for deleting can only be authorId, category, tags, subcategory or isPublished",
      });
    }
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
