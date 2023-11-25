import express, { Request, Response } from 'express';
import { Product } from '../productModel';
import {
  PRODUCTS_URL,
  checkObjectId,
  ObjectNotFoundError,
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
  checkObjectId,
  async (req: Request, res: Response) => {
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
      res.send(updatedProduct.toJSON());
    } else {
      throw new ObjectNotFoundError('Product not found');
    }
  }
);
export { router as updateProductRouter };
