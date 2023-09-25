const express = require("express");
const { authMiddleware } = require("../Middleware/authMiddleware");
const { employeeModel } = require("../Models/employeeModel");

const employeeRouter = express.Router();

employeeRouter.use(authMiddleware);

employeeRouter.post("/", async (req, res) => {
  try {
    const { user_email } = req.body;
    if (user_email) {
      const post = new employeeModel(req.body);
      await post.save();
      res.status(200).json({ msg: "employee Added Sucessfully..." });
    } else {
      res.status(400).json({ error: "Please Login..." });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

employeeRouter.get("/", async (req, res) => {
  const { page, department, search, sort } = req.query;
  const skip = (page - 1) * 5;
  const query = {};
  const { user_email } = req.body;

  if (user_email) {
    query.user_email = user_email;
  }
  if (department) {
    query.department = department;
  }

  if (search) {
    query.first_name = search;
  }
  try {
    const post = await employeeModel
      .find(query)
      .sort({ salery: sort == "asc" ? 1 : -1 })
      .skip(skip)
      .limit(5);
    res.status(200).json({ post: post });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

employeeRouter.patch("/edit/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user_email } = req.body;
    const post = await employeeModel.findByIdAndUpdate(
      { user_email, _id: postId },
      req.body
    );
    if (!post) {
      res.status(400).send({ error: "Employee not found" });
    } else {
      res.status(200).json({ msg: "post updated" });
    }
  } catch (error) {
    res.status(400).send({ error: "Employee not found" });
  }
});

employeeRouter.delete("/delete/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { user_email } = req.body;
    const post = await employeeModel.findByIdAndDelete({
      user_email,
      _id: postId,
    });
    if (!post) {
      res.status(400).send({ error: "Employee not found" });
    } else {
      res.status(200).json({ msg: "post Deleted" });
    }
  } catch (error) {
    res.status(400).send({ error: "Employee not found" });
  }
});

module.exports = {
  employeeRouter,
};
