const PublicLead = require("../Models/PublicLead");
const Project = require("../Models/Project");
const { default: isEmail } = require("validator/lib/isEmail");

/**
 * Valide le format d'un numéro de téléphone
 * @param {string} phone - Le numéro de téléphone à valider
 * @returns {boolean} - True si le format est valide
 */
const validatePhoneNumber = (phone) => {
  // Format accepté: peut contenir des chiffres, espaces, tirets, parenthèses, et le signe +
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  // Doit contenir au moins 8 chiffres
  const digitCount = phone.replace(/\D/g, "").length;
  return phoneRegex.test(phone) && digitCount >= 8;
};

/**
 * Soumet un nouveau lead public
 * POST /api/public/leads
 */
const submitLead = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, description } = req.body;

    // Validation des champs requis
    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({
        message: "Les champs fullName, email et phoneNumber sont requis",
      });
    }

    // Validation du format email
    if (!isEmail(email)) {
      return res.status(400).json({
        message: "Le format de l'email n'est pas valide",
      });
    }

    // Validation du format téléphone
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        message: "Le format du numéro de téléphone n'est pas valide",
      });
    }

    // Création du lead
    const lead = new PublicLead({
      fullName,
      email,
      phoneNumber,
      address: address || "",
      description: description || "",
    });

    await lead.save();

    return res.status(201).json({
      message: "Lead soumis avec succès",
      data: {
        id: lead._id,
        fullName: lead.fullName,
        email: lead.email,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    // Gestion des erreurs de validation MongoDB
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Erreur de validation",
        error: error.message,
      });
    }

    return res.status(500).json({
      message: "Erreur serveur lors de la soumission du lead",
      error: error.message,
    });
  }
};

/**
 * Calcule le pourcentage de progression d'un projet basé sur ses phases
 * @param {Array} phases - Tableau des phases du projet
 * @returns {number} - Pourcentage de progression (0-100)
 */
const calculateProgressPercentage = (phases) => {
  if (!phases || phases.length === 0) {
    return 0;
  }

  let totalPercentage = 0;
  let validPhases = 0;

  phases.forEach((phase) => {
    if (phase && phase.pourcentage) {
      const percentage = parseFloat(phase.pourcentage);
      if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        totalPercentage += percentage;
        validPhases++;
      }
    }
  });

  if (validPhases === 0) {
    return 0;
  }

  return Math.round(totalPercentage / validPhases);
};

/**
 * Formate les images pour la réponse publique
 * @param {Array} photos - Tableau des photos populées
 * @returns {Object} - Objet avec mainImage et galleryImages
 */
const formatImages = (photos) => {
  if (!photos || photos.length === 0) {
    return {
      mainImage: null,
      galleryImages: [],
    };
  }

  const formattedPhotos = photos.map((photo) => {
    if (photo && photo.FilePath) {
      // Construire l'URL complète de l'image
      return `/${photo.FilePath}`;
    }
    return null;
  }).filter((url) => url !== null);

  return {
    mainImage: formattedPhotos[0] || null,
    galleryImages: formattedPhotos,
  };
};

/**
 * Récupère la liste des projets publics
 * GET /api/public/projects
 */
const getPublicProjects = async (req, res) => {
  try {
    // Récupérer uniquement les projets non supprimés, triés par date de création décroissante
    const projects = await Project.find({ isDeleted: false })
      .populate("photos")
      .populate("phases")
      .select("name location description photos phases")
      .sort({ createdAt: -1 })
      .lean();

    // Formater les projets pour l'affichage public
    const publicProjects = projects.map((project) => {
      const images = formatImages(project.photos);
      const progressPercentage = calculateProgressPercentage(project.phases);

      return {
        id: project._id,
        name: project.name || "",
        location: project.location || "",
        description: project.description || "",
        mainImage: images.mainImage,
        galleryImages: images.galleryImages,
        progressPercentage: progressPercentage,
      };
    });

    return res.status(200).json({
      message: "Projets récupérés avec succès",
      data: publicProjects,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des projets",
      error: error.message,
    });
  }
};

module.exports = {
  submitLead,
  getPublicProjects,
};

