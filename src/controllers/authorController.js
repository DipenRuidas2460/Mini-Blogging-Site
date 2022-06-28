const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");

function isNum(val) {
  return !isNaN(val)
}


// Creating author request handler =


const createAuthor = async function (req, res) {
  try {
    let authorData = req.body;
    if (Object.keys(authorData).length == 0) {
      return res.status(400).send({ status: false, msg: "data can't be empty" });
    }
    if (!authorData.fname)
      return res.status(400).send({ status: false, msg: "Please include the first name" });
    if (typeof (authorData.fname) != "string") { return res.status(400).send({ status: false, msg: "fname must be a string" }); }

    if ((authorData.fname).trim().length === 0) { { return res.status(400).send({ status: false, msg: "fname can't be empty" }); } }
    if (isNum(authorData.fname) === true) { return res.status(400).send({ status: false, msg: "fname cannot be a number" }); }
    if ((authorData.fname).includes(" ")) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in fname" }); } }

    if (!authorData.lname) { return res.status(400).send({ status: false, error: "Please include the last name" }); }
    if (typeof (authorData.lname) != "string") { return res.status(400).send({ status: false, msg: "lname must be a string" }); }
    if ((authorData.lname).trim().length === 0) { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in lname" }); }
    if (isNum(authorData.lname) === true) { return res.status(400).send({ status: false, msg: "lname cannot be a number" }); }
    if ((authorData.lname).includes(" ")) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in lname" }); } }

    if (!authorData.title) { return res.status(400).send({ status: false, msg: "Please include a title" }) };
    if (typeof (authorData.title) != "string") { return res.status(400).send({ status: false, msg: "Title is not string" }); }
    if ((authorData.title).trim().length === 0) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces around title" }); } }
    if ((authorData.title).includes(" ")) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in title" }); } }
    if (authorData.title != "Mr" && authorData.title != "Mrs" && authorData.title != "Miss") return res.status(400).send({ status: false, msg: "Please use a valid title" })



    if (!authorData.email) { return res.status(400).send({ status: false, msg: "Please include an email" }) };
    if (typeof (authorData.email) != "string") { return res.status(400).send({ status: false, msg: "Email is not string" }); }
    if ((authorData.email).trim().length === 0) { return res.status(400).send({ status: false, msg: "Please remove any empty spaces around email" }); }
    if ((authorData.email).includes(" ")) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in email" }); } }

    let emailOld = await authorModel.findOne({ email: authorData.email })
    if (emailOld != null) { { return res.status(400).send({ status: false, msg: "email already exists" }) } }


    if (!authorData.password) { return res.status(400).send({ status: false, msg: "Please include a password" }) };
    if (typeof (authorData.password) != "string") { return res.status(400).send({ status: false, msg: "password is not string" }); }
    if ((authorData.password).trim().length === 0) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces around password" }); } }
    if ((authorData.password).includes(" ")) { { return res.status(400).send({ status: false, msg: "Please remove any empty spaces in password" }); } }
    if (((authorData.password).length) <= 8) { return res.status(400).send({ status: false, msg: "Password should be more than 8" }) }


    let savedData = await authorModel.create(authorData);
    return res.status(201).send({ status: true, msg: "Data is successfully created", data: savedData, });
  } catch (err) {
    return res.status(500).send({ status: false, msg: "Error", error: err.message });
  }
};

//login Author request handler =

const loginAuthor = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({ status: false, msg: "login info can't be empty" });
    }
    let userName = req.body.email;
    let password = req.body.password;
    if (!userName) { return res.status(400).send({ status: false, msg: "Please include a email" }); }
    if (!password) { return res.status(400).send({ status: false, msg: "Please include a password." }); }

    let author = await authorModel.findOne({
      email: userName,
      password: password
    });
    if (!author) return res.status(404).send({ status: false, msg: "email or the password is not correct" });

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        batch: "radon",
        organization: "FunctionUp",
      },
      "batch-19"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, msg: "Welcome you have successfully loggedin", token: token });
  } catch (err) {
    res.status(500).send({ msg: "Error", error: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;
