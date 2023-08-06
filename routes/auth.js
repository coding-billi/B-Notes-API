const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUserID = require("../middleware/fetchuserID");

router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 4 }),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      let salt = await bcrypt.genSalt(10);
      let securePass = await bcrypt.hash(request.body.password, salt);

      let newUser = await User.create({
        name: request.body.name,
        email: request.body.email,
        password: securePass,
      });
      // const createdUser = await newUser.save();    <= we dont need this User.create() already saves it to the database

      response.json(newUser);
    } catch (error) {
      console.error("Error:", error);
      response.status(500).json({ error: "Something went wrong" });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter a valid password").exists(),
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        response.status(400).json({ error: "please koi backchodi na karein" });
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        response.status(400).json({ error: "no backchodi plz" });
      }

      const data = {
        user: {
          id: user._id,
        },
      };

      const token = jwt.sign(data, "secretkey");
      response.json({ token: token });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/getuser", fetchUserID, async (request, response) => {
  try {
    const userID = request.user.id;
    const user = await User.findById(userID).select("-password");
    response.send(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
