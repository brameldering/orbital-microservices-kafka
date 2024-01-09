import express, { Response, NextFunction } from 'express';
import {
  PRODUCTS_URL,
  Product,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  PRODUCTS_APIS,
  checkObjectId,
  ObjectNotFoundError,
  kafkaWrapper,
  Topics,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Update a product
// @route   PUT /api/products/v2/:id
// @access  Admin
// @req     params.id
//          body {Product}
// @res     (updatedProduct)
//       or status(404).ObjectNotFoundError(Product not found)
router.put(
  PRODUCTS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(PRODUCTS_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Products']
      #swagger.description = 'Update a product'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Product id of product to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['Product'] = {
              in: 'body',
              description: 'Product object',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
            description: 'Updated product'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Product not found)'
      }
  } */
    const {
      name,
      price,
      description,
      imageURL,
      brand,
      category,
      countInStock,
    } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.imageURL = imageURL;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
      const updatedProduct = await product.save();

      // Post created product on kafka
      await kafkaWrapper.publishers[Topics.ProductUpdated].publish(
        updatedProduct._id.toString(),
        {
          id: updatedProduct._id,
          productId: updatedProduct.sequentialProductId,
          name: updatedProduct.name,
          brand: updatedProduct.brand,
          category: updatedProduct.category,
        }
      );

      res.send(updatedProduct.toJSON());
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);
export { router as updateProductRouter };
