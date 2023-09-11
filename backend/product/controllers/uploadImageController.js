import asyncHandler from '../../general/middleware/asyncHandler.js';
import { ExtendedError } from '../../general/middleware/errorMiddleware.js';
import { uploadImageToCloudinary } from '../fileUploadHelpers/uploadImageToCloudinary.js';

// ================ Upload image ================
// @desc    Upload image to cloudinary
// @route   POST /api/upload/v1/
// @access  Private/Admin
// @req     file.buffer
//          file.mimetype
//          file.originalname
// @res     status(200).send(result)
//       or status(415).message:'Image NOT uploaded'
const uploadImageController = asyncHandler(async (req, res) => {
  try {
    const imageURL = await uploadImageToCloudinary(req, res);
    res.status(201).json({
      message: 'Image uploaded successfully',
      image: imageURL,
    });
  } catch (error) {
    res.status(415);
    throw new ExtendedError('Image NOT uploaded: ' + error.message);
  }
});
export { uploadImageController };
