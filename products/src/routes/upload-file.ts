import express, { Request, Response } from 'express';
import { uploadImageToCloudinary } from './fileUploadHelpers/uploadImageToCloudinary';
import { UPLOAD_URL, protect, admin, FileUploadError } from '@orbitelco/common';

const router = express.Router();

// @desc    Upload image to cloudinary
// @route   POST /api/products/v2/upload
// @access  Admin
// @req     body: FormData.image
// @res     status(200).send({ imageURL: string })
//       or status(415).FileUploadError(message)
router.post(UPLOAD_URL, protect, admin, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
     #swagger.description = 'Upload image to cloudinary'
     #swagger.security = [{
        bearerAuth: ['admin']
      }]
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['singleFile'] = {
        in: 'formData',
        type: 'file',
        required: 'true',
        description: 'Binary data corresponding to file',
     }
     #swagger.responses[200] = {
        description: '{ imageURL: string }',
     }
     #swagger.responses[415] = {
        description: 'FileUploadError',
} */
  try {
    const imageURL = await uploadImageToCloudinary(req, res);
    res.send({
      message: 'Image uploaded',
      imageURL: imageURL,
    });
  } catch (error: any) {
    const message = error.message | error.toString();
    throw new FileUploadError('Image NOT uploaded: ' + message);
  }
});

export { router as uploadFileRouter };
