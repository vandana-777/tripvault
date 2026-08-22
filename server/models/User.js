const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
  type: String,
  required: false,
  unique: true,
  sparse: true,
  trim: true,
  lowercase: true,
},

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
},

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);