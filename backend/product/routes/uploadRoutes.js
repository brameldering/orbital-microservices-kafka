import path from 'path';
import express from 'express';

import uploadSingleImageToDisk from '../fileUploadHelpers/uploadToDisk.js';
import uploadSingleImageToCloudinary, {
  handleUpload,
} from '../fileUploadHelpers/uploadToCloudinary.js';

const router = express.Router();

router.post('/', (req, res) => {
  uploadSingleImageToDisk(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: err.message });
    }
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: path.sep + `${req.file.path}`,
    });
  });
});

router.post('/cloudinary', uploadSingleImageToCloudinary, async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await handleUpload(dataURI);
    console.log('===> cldRes:', cldRes.secure_url);
    res.status(200).send({
      message: 'Image uploaded successfully',
      image: cldRes.secure_url,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error.message,
    });
  }
});

export default router;
