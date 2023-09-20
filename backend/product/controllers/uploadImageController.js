import asyncHandler from '../../general/middleware/asyncHandler.js';
import { ExtendedError } from '../../general/middleware/errorMiddleware.js';
import { uploadImageToCloudinary } from '../fileUploadHelpers/uploadImageToCloudinary.js';

// ================ Upload image ================
// @desc    Upload image to cloudinary
// @route   POST /api/upload/v1/
// @access  Private/Admin
// @req     body: FormData.image
// @res     status(200).send(result)
//       or status(415).message:'Image NOT uploaded'
const uploadImage = asyncHandler(async (req, res) => {
  try {
    const imageURL = await uploadImageToCloudinary(req, res);
    res.status(201).json({
      message: 'Image uploaded',
      imageURL: imageURL,
    });
  } catch (error) {
    console.log(error);
    throw new ExtendedError('Image NOT uploaded: ' + error.message, 415);
  }
});
export { uploadImage };
