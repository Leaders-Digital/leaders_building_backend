const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { default: isEmail } = require("validator/lib/isEmail");

// Password validation function
const isPassword = (value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=[\]{}|;:'",.<>?/`~\\/-]{8,}$/;
  return passwordRegex.test(value);
};

// Prospect Schema
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
        validator: isEmail,
        message: "The email is not in a valid format",
      },
    },
    telephone: {
      type: [String],
      required: true,
    },
    adresse: {
      type: String,
      required: true,
    },
    dateDeNaissance: {
      type: Date,
    },
    password: {
      type: String,
      validate: {
        validator: isPassword,
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
        message: "The CIN should be exactly 8 numeric digits",
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    stage: {
      type: String,
      enum: ["prospection", "suivi", "factorisation", "conversion", "abondon"],
      default: "prospection",
    },
    status: {
      type: String,
      required: true,
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
      enum: ["agence", "rs", "Site Web", "autre"],
    },
    agence: {
      name: {
        type: String,
      },
      agent: {
        type: String,
      },
    },
    socialMedia: {
      platform: {
        type: String,
      },
      link: {
        type: String,
      },
    },
    otherSourceDescription: {
      type: String,
      default: null,
    },
    service: {
      type: String,
      required: true,
    },
    profilePicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    percent: {
      type: String,
    },
    lotissement: {
      type: String,
    },
    lotissementCords: {
      nom: {
        type: String,
      },
      numLot: {
        type: String,
      },
    },
    adressParticulier: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Password hash middleware
ProspectSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.type === "client" && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
      return next(e);
    }
  }
  next();
});

// Index for stage
ProspectSchema.index({ stage: 1 });

module.exports = mongoose.model("Prospect", ProspectSchema);
