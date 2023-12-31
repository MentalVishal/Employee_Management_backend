const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
  },
  { versionKey: false }
);

const userModel = mongoose.model("User", userSchema);

module.exports = {
  userModel,
};
