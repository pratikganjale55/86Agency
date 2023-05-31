const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rePassword: { type: String, required: true },
  follow: { type: Number, default: 0 },
});

const userModel = mongoose.model("86AgencyUser", userSchema);

module.exports = userModel;
