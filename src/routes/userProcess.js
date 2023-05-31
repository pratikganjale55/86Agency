const dotenv = require("dotenv");
dotenv.config();
const Router = require("express");
const processRouter = Router();
const userDetails = require("../models/userModel.js");

/**
 * @swagger
 *
 * /users/follow/{userId}:
 *   post:
 *     summary: Follow a user by their ID.
 *     description: Follow a user by their ID.
 *     parameters :
 *            - name : userId
 *              in : path
 *              description  : Follow a user by their ID.
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully follow a user by their ID.
 *       401:
 *          description: check user userId
 *       501 :
 *            description: Internet server problem
 *
 */

processRouter.post("/follow/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const userData = await userDetails.findOneAndUpdate(
      { _id: userId },
      { $inc: { follow: 1 } }
    );

    if (!userData) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({
      message: `You have successfully followed user with ID ${userId}`,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred" });
  }
});


/**
 * @swagger
 *
 * /users/unfollow/{userId}:
 *   post:
 *     summary: Unfollow a user by their ID.
 *     description: Unfollow a user by their ID.
 *     parameters :
 *            - name : userId
 *              in : path
 *              description  : Unfollow a user by their ID.
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully Unfollow a user by their ID.
 *       401:
 *          description: check user userId
 *       501 :
 *            description: Internet server problem
 *
 */

processRouter.post("/Unfollow/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(userId)
      if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
      }
  
      const userData = await userDetails.findOneAndUpdate(
        { _id: userId },
        { $inc: { follow: -1 } }
      );
     
      if (!userData) {
        return res.status(404).send({ message: "User not found" });
      }
  
      return res.status(200).send({
        message: `You have successfully Unfollowed user with ID ${userId}`,
      });
    } catch (error) {
      return res.status(500).send({ message: "An error occurred" });
    }
  });

module.exports = processRouter;
