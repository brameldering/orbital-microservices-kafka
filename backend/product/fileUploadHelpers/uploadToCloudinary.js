import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from '../../general/middleware/asyncHandler.js';
import fileFilter from './imageFileFilter.js';
import { MAX_IMAGE_FILE_SIZE } from '../../constantsBackend.js';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
const memoryStorage = multer.memoryStorage();
const multerUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_IMAGE_FILE_SIZE },
  fileFilter,
});

// This function is configured as middleware in server.js
const configFileUploadCloudinary = (req, res, next) => {
  // console.warn('===> configFileUploadCloudinary');
  // console.log(req)
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  multerUpload.single('image')(req, res, (err) => {
    console.log('configFileUploadCloudinary --> upload.single');
    if (err) {
      console.error('configFileUploadCloudinary --> upload.single === Error ');
      return res
        .status(400)
        .json({ error: 'configFileUploadCloudinary: File upload failed' });
    }
  });
  next();

  // multerUpload.single('image')(req, res, (err) => {
  //   console.log('configFileUploadCloudinary --> upload.single');
  //   if (err) {
  //     console.error('configFileUploadCloudinary --> upload.single === Error ');
  //     return res
  //       .status(400)
  //       .json({ error: 'configFileUploadCloudinary: File upload failed' });
  //   }
  // });
};

const uploadImageToCloudinary = asyncHandler(async (req, res) => {
  try {
    console.warn('===> uploadImageToCloudinary req');
    // console.log(req);
    // console.warn('===== uploadImageToCloudinary after req =================');
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
    });
    console.log('===> cldRes:', cldRes);
    console.log('===> cldRes:', cldRes.secure_url);

    return { message: 'Image uploaded successfully', image: cldRes.secure_url };
    // res.status(200).send({
    //   message: 'Image uploaded successfully',
    //   image: cldRes.secure_url,
    // });
  } catch (error) {
    // TO IMPROVE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    console.log('uploadImageToCloudinary error', error);
    // res.status(400).send({
    //   message: error.message,
    // });
  }
});

const removeImageFromCloudinary = async (imageURL) => {
  const fileNameWithoutExtFromURL = /([\w\d_-]*)\.?[^\\\/]*$/i;
  const imageId = imageURL.match(fileNameWithoutExtFromURL)[1];
  await cloudinary.api.delete_resources([imageId], {
    type: 'upload',
    resource_type: 'image',
  });
};

export {
  cloudinary,
  configFileUploadCloudinary,
  uploadImageToCloudinary,
  removeImageFromCloudinary,
};
