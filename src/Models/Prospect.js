const mongoose = require("mongoose");
const validator = require("validator");
const bycript = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");

const ProspectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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
          return isEmail(value);
        },
        message: "the emain is not valid format",
      },
    },
    telephone: {
      type: String,
      required: true,
    },
    adresse: {
      type: String,
    },
    dateDeNaissance: {
      type: Date,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          return isPassword(value);
        },
        message:
          "Password must be at least 8 characters long, and include one uppercase letter, one number, and one special character",
      },
    },
    type: {
      type: String,
      enum: ["client", "prospect"],
      default: "prospect",
    },

    CIN: {
      type: String,
      validate: {
        validator: function (value) {
          return (
            validator.isNumeric(value) &&
            validator.isLength(value, { min: 8, max: 8 })
          );
        },
        message: "the cin should be 8 numbers ",
      },
    },
    isDeleted: { type: Boolean, default: false },
    stage: {
      type: String,
      enum: ["prospection", "suivi", "factorisation", "conversion", "abondon"],
      default: "prospection",
    },
    status: {
      type: String,
    },
    propertyType: {
      type: String,
      enum: ["RDC", "R+N", "Autre"],
    },
    propertyDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    projectType: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["Agence", "Social Media", "Other"],
    },
    agence: {
      name: { type: String },
      agent: { type: String },
    },
    socialMedia: {
      platform: { type: String },
      link: { type: String },
    },
    otherSourceDescription: {
      type: String,
      default: null,
    },
    service: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
ProspectSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.type === "client" && this.password) {
    try {
      const salt = await bycript.genSalt(10);
      this.password = await bycript.hash(this.password, salt);
    } catch (e) {
      return next(e);
    }
  } else if (this.isModified("password") && this.type === "client") {
    try {
      const salt = await bycript.genSalt(10);
      this.password = await bycript.hash(this.password, salt);
    } catch (e) {
      return next(e);
    }
  }
  next();
});
const isPassword = (value) => {
  const passwordRgex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{}|;:'",.<>?/`~\\/-]{8,}$/;
  return passwordRgex.test(value);
};
module.exports = mongoose.model("Prospect", ProspectSchema);
