const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
const mongoose = require("mongoose");


const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-Api-key"];
    if (!token) { return res.status(400).send({ status: false, msg: "token must be present" }) };

    if (token.length != 215) { return res.status(400).send({ status: false, msg: "token must be valid" }) };
    let decodedToken = jwt.verify(token, "batch-19");
    if (decodedToken.length == 0) {
      return res.status(404).send({ status: false, msg: "token is not valid" })
    };
    next();
  } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};

const authorize = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      token = req.headers["x-Api-key"];
    }
    let decodedToken = jwt.verify(token, "batch-19");
    let authorLoggedIn = decodedToken.authorId;

    let authId;
    let blogToBeModified;
    if (Object.keys(req.params).length != 0) {

      blogToBeModified = req.params.blogId
      if (!mongoose.isValidObjectId(blogToBeModified)) return res.status(400).send({ msg: "Invalid Id" })
      authId = await blogModel.findById(blogToBeModified).select("authorId");

      if (authId.length == 0) {
        return res.status(400).send({ status: false, msg: "Please use correct blog Id" })
      };
      let auth = authId.authorId
      //console.log("this is" ,auth) */
      if (auth != authorLoggedIn) {
        return res.status(403).send({ status: false, msg: "Author logged is not allowed to modify the requested  data" })
      };


    }

    if (Object.keys(req.query).length != 0) {
      blogToBeModified = req.query
      authId = await blogModel.find(blogToBeModified).select("authorId");
      if (authId.length == 0) {
        return res.status(400).send({ status: false, msg: "Please use correct parameters" })
      };
      //let auth;
      for (let i = 0; i < authId.length; i++) {

        auth = authId[i].authorId;
      }
      //console.log("this is" ,auth)
      if (auth != authorLoggedIn)
        return res.status(403).send({
          status: false,
          msg: "Author logged is not allowed to modify the requested  data"
        });

    }




    //console.log(blogToBeModified)
    if (!blogToBeModified) {
      return res.status(400).send({ status: false, msg: "Please include a parameter" });
    }




    next();


  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.authenticate = authenticate;
module.exports.authorize = authorize;




