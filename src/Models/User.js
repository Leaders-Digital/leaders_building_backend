const mongoose = require("mongoose");
const bycript = require("bcrypt");
const validator = require("validator");
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },

    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "This is not a correct format for an email",
      },
    },
    telephone: {
      type: String,
    },
    adresse: {
      type: String,
    },
    dateDeNaissance: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return isPassword(value);
        },
        message:
          "Password must be at least 8 characters long, and include one uppercase letter, one number, and one special character",
      },
    },
    department: { type: String },
    role: {
      type: String,
      enum: ["admin", "user", "client"],
      required: true,
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Prospect" },

    profilePic: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bycript.hash(this.password, 8);
  next();
});

const isPassword = (value) => {
  const passwordRgex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{}|;:'",.<>?/`~\\/-]{8,}$/;
  return passwordRgex.test(value);
};

UserSchema.methods.comparePassword = function (password) {
  return bycript.compare(password, this.password);
};
module.exports = mongoose.model("User", UserSchema);
