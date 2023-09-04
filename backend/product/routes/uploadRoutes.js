import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// let uploadSingleImage;
// if (process.env.IMAGES_ON_SERVER_OR_CLOUDINARY === 'cloudinary') {
//   uploadSingleImage = function () {
//     console.log(test);
//   };
// } else {
//   uploadSingleImage = (await import('../fileUploadHelpers/uploadToDisk.js'))
//     .uploadSingleImage;
// }

let storage;

if (process.env.IMAGES_ON_SERVER_OR_CLOUDINARY === 'cloudinary') {
  storage = multer.memoryStorage();
} else {
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads');
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
}

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single('image');

router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: path.sep + `${req.file.path}`,
    });
  });
});

export default router;
