const router = require("express").Router();
const { json } = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", (req, res) => {
  // validate request
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "All fields are required" });
  }
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      throw err;
    }
    if (user) {
      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            const accessToken = jwt.sign(
              {
                id: user._id,
                name: user.name,
                email: user.email,
              },
              process.env.JWT_TOKEN_SECRET,
              { expiresIn: "30s" }
            );
            return res.send({
              accessToken: accessToken,
              type: "Bearer",
            });
          } else {
            return res
              .status(401)
              .json({ error: "Email or password is wrong" });
          }
        })
        .catch((err) => {
          throw err;
        });
    } else {
      return res.status(401).json({ error: "Email or password is wrong" });
    }
  });
});
module.exports = router;
