import { uploadImageToCloudinary } from '../fileUploadHelpers/uploadImageToCloudinary.js';
import asyncHandler from '../../general/middleware/asyncHandler.js';

// ================ Upload image ================
// @desc    Upload image to cloudinary
// @route   POST /api/upload/v1/
// @access  Private/Admin
// @req     file.buffer
//          file.mimetype
//          file.originalname
// @res     status(200).send(result)
//       or status(415).send({message: 'Image NOT uploaded: ' + error.message});
const uploadImageController = asyncHandler(async (req, res) => {
  try {
    const imageURL = await uploadImageToCloudinary(req, res);
    console.info('=== uploadImageController - imageURL', imageURL);
    res
      .status(201)
      .json({ message: 'Image uploaded successfully', image: imageURL });
  } catch (error) {
    console.error('=== uploadImageController - error', error);
    res.status(415);
    throw new Error('Image NOT uploaded: ' + error.message);
  }
});
export { uploadImageController };
