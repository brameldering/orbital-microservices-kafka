import { uploadImageToCloudinary } from '../fileUploadHelpers/uploadToCloudinary.js';
import asyncHandler from '../../general/middleware/asyncHandler.js';

// ================ Upload image ================
// @desc    Upload image to serverdisk or cloudinary
// @route   POST /api/upload/v1/
// @access  public
const uploadImageController = asyncHandler(async (req, res) => {
  try {
    const result = await uploadImageToCloudinary(req, res);
    console.warn('=== uploadImageController - result', result);
    res.status(200).send(result);
  } catch (error) {
    console.error('=== uploadImageController - error', error);
    res.status(400).send({
      message: 'Image NOT uploaded: ' + error.message,
    });
  }
});

export default uploadImageController;
