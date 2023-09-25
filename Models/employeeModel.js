const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema(
  {
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true },
    department: { type: String, require: true },
    salery: { type: Number, require: true },
    user_email: { type: String, require: true },
  },
  { versionKey: false }
);

const employeeModel = mongoose.model("Employee", employeeSchema);

module.exports = {
  employeeModel,
};
