import { uploadImageToCloudinary } from '../fileUploadHelpers/uploadToCloudinary.js';
import { uploadImageToDisk } from '../fileUploadHelpers/uploadToDisk.js';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import {
  ENV_CONFIG_CLOUDINARY,
  ENV_CONFIG_SERVER_DISK,
} from '../../constantsBackend.js';

// ================ Upload image ================
// @desc    Upload image to serverdisk or cloudinary
// @route   POST /api/upload/v1/
// @access  public
const uploadImageController = asyncHandler(async (req, res) => {
  let result = {};
  try {
    if (process.env.IMAGE_STORAGE_LOCATION === ENV_CONFIG_CLOUDINARY) {
      result = await uploadImageToCloudinary(req, res);
      console.warn('=== uploadImageController - result', result);
    } else {
      if (process.env.IMAGE_STORAGE_LOCATION === ENV_CONFIG_SERVER_DISK) {
        result = await uploadImageToDisk(req, res);
      }
    }
    res.status(200).send(result);
  } catch (error) {
    console.error('=== uploadImageController - error', error);
    res.status(400).send({
      message: 'Image NOT uploaded: ' + error.message,
    });
  }
});

export default uploadImageController;
