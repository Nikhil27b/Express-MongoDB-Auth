const mongoose = require("mongoose");
const valid = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already present"],
    validate(value) {
      if (!valid.isEmail(value)) {
        throw new Error("Invaild Email");
      }
    },
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.genrateAuthToken = async function () {
  try {
    console.log("User Id" + this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
     process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({token:token})
    await this.save();
    return token;
  } catch (error) {
    res.send("Jwt token error" + error);
  }
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

const Users = new mongoose.model("Users", userSchema);

module.exports = Users;
