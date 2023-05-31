const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./src/database/db");
const authRoute = require("./src/routes/users");
const userPosts = require("./src/routes/usersPost");
const userProcess= require("./src/routes/userProcess");
const { swaggerUi, swaggerSpec } = require("./swagger");
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoute);
app.use("/users", userProcess);
app.use("/posts", userPosts);

app.get("/", (req, res) => {
  res.send({ message: "welcome to our website" });
});

app.listen(process.env.PORT, async () => {
  await connection;
  console.log(`server start at ${process.env.PORT} `);
});
