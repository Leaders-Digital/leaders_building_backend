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
                message: "the email is not valid format",
            },
        },
        telephone: {
            type: [String],
            required: true,
        },
        whatsapp: {
            type: String,
            required: true,
        },
        adresse: {
            type: String,
            required: true, // Corrigé: require -> required
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
        prospectType: {
            type: String,
            required: true,
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
        situation: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },

        // Détails du projet
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
        service: {
            type: String,
            required: true,
        },

        // Nouveaux champs détails du projet
        localisationProjet: {
            type: String,
            required: true,
        },
        terrainInclus: {
            type: String,
            enum: ["oui", "non"],
            required: true,
        },
        superficieTerrain: {
            type: Number,
            required: true,
        },
        surfaceBatie: {
            type: Number,
            required: true,
        },
        contraintesLegales: {
            type: String,
            enum: ["oui", "non"],
            required: true,
        },
        detailsContraintes: {
            type: String,
            default: null,
        },

        // Champs budget et financement
        budgetEstime: {
            type: Number,
            required: true,
        },
        modeFinancement: {
            type: String,
            enum: ["fonds_propres", "pret_bancaire", "partenaire_investisseur"],
            required: true,
        },
        prioriteQualitePrix: {
            type: String,
            enum: ["priorite_economies", "equilibre_qualite_cout", "priorite_qualite_haut_gamme"],
            required: true,
        },

        // Champs délais et planning
        debutTravaux: {
            type: Date,
            required: true,
        },
        dateLimiteLivraison: {
            type: Date,
            required: true,
        },
        flexibiliteDelais: {
            type: String,
            enum: ["oui", "non"],
            required: true,
        },
        travauxPlusieursPhases: {
            type: String,
            enum: ["oui", "non"],
            required: true,
        },

        // Champs source
        source: {
            type: String,
            required: true,
            enum: ["agence", "rs", "Site Web", "autre"],
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

        // Autres champs
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

        // Anciens champs localisation (à conserver pour compatibilité)
        lotissement: { type: String },
        lotissementCords: {
            nom: { type: String },
            numLot: { type: String },
        },
        adressParticulier: {
            type: String,
        },

        // Champ supprimé car remplacé par contraintesLegales
        // legalConstraint: {
        //   type: Boolean,
        //   required: true,
        // },
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

ProspectSchema.index({ stage: 1 });

module.exports = mongoose.model("Prospect", ProspectSchema);