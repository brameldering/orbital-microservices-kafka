import path from 'path';
import {
  cloudinary,
  cloudinarySettings,
} from '../fileUploadHelpers/uploadToCloudinary.js';
import { uploadSingleImageToDisk } from '../fileUploadHelpers/uploadToDisk.js';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import { UPLOADS_URL } from '../../constantsBackend.js';

// ================ Upload to Server Disk ================
// @desc    Upload image to server disk
// @route   POST /api/upload/v1/disk
// @access  public
const uploadImageToDisk = asyncHandler(async (req, res) => {
  uploadSingleImageToDisk(req, res, function (err) {
    if (err) {
      res.status(400).send({ message: 'Image NOT uploaded: ' + err.message });
    } else {
      res.status(200).send({
        message: 'Image uploaded successfully',
        image: path.sep + UPLOADS_URL + path.sep + `${req.file.filename}`,
      });
    }
  });
});

// ================ Upload to Cloudinary ================
// @desc    Upload image to cloudinary
// @route   POST /api/upload/v1/cloudinary
// @access  public
const uploadImageToCloudinary = asyncHandler(async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    // console.log('===> cldRes:', cldRes.secure_url);
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

export { uploadImageToDisk, cloudinarySettings, uploadImageToCloudinary };
