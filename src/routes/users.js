const dotenv = require("dotenv");
dotenv.config();
const Router = require("express");
const authRoute = Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken")
// Define signup and login database for swagger //

/**
 * @swagger
 * components:
 *      schema :
 *         signup :
 *                   type : object
 *                   properties :
 *                      name :
 *                             type :  string
 *                      email :
 *                             type :  string
 *                      password :
 *                             type :  string
 *                      rePassword :
 *                              type :  string
 *
 *
 *
 *         login :
 *                  type : object
 *                  properties :
 *                      email :
 *                             type : string
 *                      password :
 *                             type : string
 *
 */
// signup swagger API //
 
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: user sign up post data
 *     description: user create account
 *     requestBody :
 *             required : true
 *             content :
 *                  application/json :
 *                           schema :
 *                              $ref : "#/components/schema/signup"
 *     responses:
 *       200:
 *         description: Successfully registered
 *       401:
 *          description: Data not appropriate
 *       501 :
 *          description: Internet server problem
 *
 */

// signup //
authRoute.post("/signup", async (req, res) => {
  try {
    const userMail = await userModel.findOne({ email: req.body.email });
    const { name, email, password, rePassword } = req.body;

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!name) {
      return res.send({ message: "enter user name" });
    }
    if (userMail) {
      return res.send({ message: "user already registered" });
    }
    if (password !== rePassword) {
      return res
        .status(400)
        .send({ message: "Please make sure your passwords match." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including at least 1 number, 1 lowercase letter, and 1 uppercase letter.",
      });
    }

    if (!emailReg.test(email)) {
      return res
        .status(400)
        .send({ message: "Please provide a valid email address." });
    }

    const salt = await bcrypt.genSaltSync(10);
    const Pass = await bcrypt.hash(req.body.password, salt);
    const rePass = await bcrypt.hash(req.body.rePassword, salt);

    const user = new userModel({
      ...req.body,
      password: Pass,
      rePassword: rePass,
    });

    const userDataSave = await user.save();

    if (userDataSave) {
      return res.status(201).send({ message: "Successfully registered" });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred" });
  }
});

// login //
/**
 * @swagger
 *
 * /auth/login:
 *   post:
 *     summary: user login with register email password
 *     description: user Login
 *     requestBody :
 *          required : true
 *          content :
 *             application/json :
 *                 schema :
 *                     $ref : "#/components/schema/login"
 *     responses:
 *       200:
 *         description: Successfully login
 *       401:
 *          description: check user email password
 *       501 :
 *            description: Internet server problem
 *
 */

authRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(422).send({ message: "Fill in all the details" });
    }

    const validUser = await userModel.findOne({ email });
    
    if (!validUser) {
      return res.status(401).send({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, validUser.password);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // authorize based on user role
    const token = jwt.sign(
      {
        name: validUser.name,
      },
      process.env.JWT_KEY
    );
    res.status(201).send({
      message: "Login successful",
      token,
      userDetails: {
        userName: validUser.name,
        id: validUser._id,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred" });
  }
});

module.exports = authRoute;
