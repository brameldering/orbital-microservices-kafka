import express, { Request, Response } from 'express';
import { Product } from '../productModel';
import { PRODUCTS_URL } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products/v2
// @access  Public
// @req     query.pageNumber (optional)
//          query.keyword (optional)
// @res     status(200).json({ products, page, pages })
router.get(PRODUCTS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Fetch all products'
      #swagger.parameters['pageNumber'] = {
          in: 'query',
          description: 'PageNumber in case of pagination',
          required: 'false',
          type: 'number',
      }
      #swagger.parameters['keyword'] = {
          in: 'query',
          description: 'Keyword in case of searching for products',
          required: 'false',
          type: 'string',
      }
      #swagger.responses[200] = {
          description: 'Object containing products array, pagenumber and total number of pages',
} */
  const pageSize = Number(process.env.PRODUCTS_PER_PAGE);
  let page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // Check if page is empty after a delete refresh
  if (page > 1 && products.length === 0) {
    // Current page is empty, set page - 1 and refetch
    page--;
    products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }
  const pages = Math.ceil(count / pageSize);
  res.status(200).send({ products, page, pages });
});

export { router as getProductsRouter };
