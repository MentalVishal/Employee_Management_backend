const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema(
  {
    token: { type: String, require: true },
  },
  { versionKey: false }
);

const blackListModel = mongoose.model("Blacklist", blackListSchema);

module.exports = {
  blackListModel,
};
