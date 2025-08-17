// middleware/multer-config.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  //limite la taille du fichier a 5mo
  limits: { fileSize: 5 * 1024 * 1024 },
  //Accepte un seul fichier dans le formulaire image '/lib/common - bodyFormData.append('image', data.file...;
}).single('image');


const imageOptimizer = async (req, res, next) => {
  //Si rien envoyé on passe au suivant
  if (!req.file) return next();

  try {
    //format forcé en webp
    const extension = 'webp'
    //nom du ficher composé de la date et du userId
    const filename = `${Date.now()}-${req.auth?.userId}.${extension}`;
    const outputPath = path.join('images', filename);

    // Sharp traite l'image depuis le buffer, fais les changement 
    // et les save dans le dossier images
    await sharp(req.file.buffer)
      .resize({ width: 600 })
      .toFormat(extension, { quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Erreur d'optimisation de l'image" });
  }
};

module.exports = { upload, imageOptimizer };
