const router = require("express").Router();
const User = require("../model/user");
const auth = require("../middlewares/auth");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

router.get("/", auth, (req, res) => {
  User.findOne({ email: req.user.email })
    .select("-password")
    .exec((err, user) => {
      if (err) {
        throw err;
      }
      res.send(user);
    });
});

module.exports = router;
