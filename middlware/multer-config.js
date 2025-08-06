// middleware/multer-config.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// 1. Stockage en mémoire (buffer)
const storage = multer.memoryStorage();

// 2. Middleware multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

// 3. Middleware d'optimisation
const imageOptimizer = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const extension = MIME_TYPES[req.file.mimetype] || 'webp';
    const filename = `${Date.now()}-${req.auth?.userId || 'guest'}.${extension}`;
    const outputPath = path.join('images', filename);

    // Sharp traitement
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
