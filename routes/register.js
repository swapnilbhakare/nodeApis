const router = require("express").Router();
const { json } = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Refresh = require("../model/refresh");

router.post("/", (req, res) => {
  // Authemticate request
  // validate request
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "All fields are required" });
  }
  //   check if user exist
  User.exists({ email: email }, async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "something went wrong" });
    }
    if (result) {
      return res
        .status(422)
        .json({ error: "User with this email already exist" });
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      user
        .save()
        .then((user) => {
          //jwt
          const accessToken = jwt.sign(
            {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: "30s" }
          );
          // refresh token
          const refreshToken = jwt.sign(
            {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            process.env.JWT_REFRESH_SECRET
          );

          const refreshTokenDocument = new Refresh({
            token: refreshToken,
          })
            .save()
            .then(() => {
              return res.send({
                accessToken: accessToken,
                type: "Bearer",
                refreshToken: refreshToken,
              });
            });
        })
        .catch((err) => {
          return res.status(500).send({ error: "something went wrong" });
        });
    }
  });
});

module.exports = router;
