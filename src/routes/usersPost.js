const dotenv = require("dotenv");
dotenv.config();
const Router = require("express");
const userPost = Router();
const userPostData = require("../models/userPostModel");

/**
 * @swagger
 * components:
 *      schema :
 *         posts :
 *                   type : object
 *                   properties :
 *                      title :
 *                             type :  string
 *                      content :
 *                             type :  string
 *
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

/**
 * @swagger
 * /posts:
 *   get:
 *     summary:  Retrieve a list of all posts from followed users
 *     description:  Retrieve a list of all posts from followed users
 *     responses:
 *       200:
 *         description:  Successfully get a list of all posts from followed users
 *       401:
 *          description: Unauthorized
 *       501:
 *          description: Internet server problem
 */
userPost.get("/", async (req, res) => {
  try {
    const userAllPosts = await userPostData.find({});
    if (userAllPosts.length == 0) {
      return res.status(404).send({ message: "No data found" });
    }

    return res.status(201).send({
      message: "All users posts data",
      userAllPosts,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", error });
  }
});
/**
 * @swagger
 *
 * /posts/{id}:
 *   get:
 *     summary:  Retrieve a specific post by its ID.
 *     description:  Retrieve a specific post by its ID.
 *     parameters :
 *            - name : id
 *              in : path
 *              description  : Retrieve a specific post by its ID.
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *
 *     responses:
 *       200:
 *         description:  Successfully get specific post by its ID.
 *       401:
 *          description: Unauthorized
 *       501:
 *          description: Internet server problem
 */
userPost.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userAllPosts = await userPostData.findById({ _id: id });
    if (userAllPosts.length == 0) {
      return res.status(404).send({ message: "No data found" });
    }

    return res.status(201).send({
      message: "All users posts data",
      userAllPosts,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", error });
  }
});
/**
 * @swagger
 * /posts/{userId}:
 *   post:
 *     summary: Create new post of particular user id
 *     description: user create new post
 *     parameters :
 *            - name : userId
 *              in : path
 *              description  : user id to create post
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *     requestBody :
 *             required : true
 *             content :
 *                  application/json :
 *                           schema :
 *                              $ref : "#/components/schema/posts"
 *     responses:
 *       200:
 *         description: Successfully posts
 *       401:
 *          description: Data not appropriate
 *       501 :
 *          description: Internet server problem
 *
 */
userPost.post("/:userId", async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.params.userId;

    if (!title || !content) {
      return res
        .status(400)
        .send({ message: "Title and content are required" });
    }
    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
    }

    const postDataSave = new userPostData({ title, content, userId });
    const userPost = await postDataSave.save();

    if (userPost) {
      return res.status(201).send({ message: "Post created successfully" });
    }
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
});
/**
 * @swagger
 *
 * /posts/like/{id}:
 *   post:
 *     summary: Like a post by its ID.
 *     description: Like a post by its ID.
 *     parameters :
 *            - name : id
 *              in : path
 *              description  : Like a post by its ID.
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *     responses:
 *       200:
 *         description: You have liked the post with ID.
 *       401:
 *          description: check user userId
 *       501 :
 *            description: Internet server problem
 *
 */
userPost.post("/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).send({ message: "Post ID is required" });
    }
    const userPostsLike = await userPostData.findOneAndUpdate(
      { _id: postId },
      { $inc: { like: 1 } }
    );

    if (!userPostsLike) {
      return res.status(404).send({ message: "post not found" });
    }
    return res
      .status(200)
      .send({ message: `You have liked the post with ID ${postId}` });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
});

/**
 * @swagger
 * /posts/edit/{id}:
 *  put:
 *     summary: Update an existing post by its ID.
 *     description: Update an existing post by its ID.
 *     parameters :
 *            - name : id
 *              in : path
 *              description  : Update an existing post by its ID.
 *              required: true
 *              minimum : 1
 *              schema :
 *               type: string
 *
 *     requestBody :
 *            required : true
 *            content :
 *               application/json:
 *                      schema:
 *                          $ref : "#/components/schema/posts"
 *     responses:
 *       200:
 *         description: successfully update an existing post by its ID.
 *       401:
 *          description: data not appropriate
 *       501 :
 *            description: Internet server problem
 *
 */

userPost.put("/edit/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    if (!postId) {
      return res.status(400).send({ message: "Post ID is required" });
    }
    const updatedPost = await userPostData.findByIdAndUpdate(
      { _id: postId },
      { title, content }
    );

    if (!updatedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    return res.status(200).send({
      message: `Post with ID ${postId} has been updated successfully`,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
});

/**
 * @swagger
 *
 * /posts/comment/{id}:
 *   post:
 *     summary: Add a comment to a post by its ID
 *     description: Add a comment to a post by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the post to add a comment to
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The comment to be added
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized - Check user authentication
 *       501:
 *         description: Server error
 */
userPost.post("/comment/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      const { comment } = req.body;
  
      if (!postId || !comment) {
        return res.status(400).send({ message: "Post ID,and comment are required" });
      }
  
      const updatedPost = await userPostData.findByIdAndUpdate(
        postId,
        { $push: { comments: { comment } } },
        { new: true }
      );
  
      if (!updatedPost) {
        return res.status(404).send({ message: "Post not found" });
      }
  
      return res.status(201).send({ message: "Comment added successfully", updatedPost });
    } catch (error) {
      return res.status(500).send({ message: "An error occurred", error });
    }
  });
/**
 * @swagger
 * /posts/delete/{id}:
 *   delete:
 *     summary:  Delete a post by its ID.
 *     description:  Delete a post by its ID.
 *     parameters :
 *            - name : id
 *              in: path
 *              description  : Delete a post by its ID.
 *              required : true
 *              schema :
 *                type : string
 *     responses:
 *       200:
 *         description: successfully delete a post by its ID.
 *       401:
 *          description: data not appropriate
 *       501 :
 *            description: Internet server problem
 *
 */

userPost.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).send({ message: "Post ID is required" });
    }
    const deletePost = await userPostData.findByIdAndDelete({ _id: postId });

    if (!deletePost) {
      return res.status(404).send({ message: "Post not found" });
    }

    return res.status(200).send({
      message: `Post with ID ${postId} has been deleted successfully`,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occurred", error });
  }
});
module.exports = userPost;
