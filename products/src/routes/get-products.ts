import express, { Request, Response } from 'express';
import { PRODUCTS_URL, Product } from '@orbitelco/common';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products/v2
// @access  Public
// @req     query.pagenumber (optional)
//          query.keyword (optional)
// @res     json({ products, page, pages })
router.get(PRODUCTS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Products']
      #swagger.description = 'Fetch all products'
      #swagger.parameters['pagenumber'] = {
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
  let page = Number(req.query.pagenumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  let productsOriginal = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  // Check if page is empty after a delete refresh
  if (page > 1 && productsOriginal.length === 0) {
    // Current page is empty, set page - 1 and refetch
    page--;
    productsOriginal = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  }
  const pages = Math.ceil(count / pageSize);
  // map products to json format as defined in product-types productSchema
  const products = productsOriginal.map((product: { toJSON: () => any }) =>
    product.toJSON()
  );
  res.send({ products, page, pages });
});

export { router as getProductsRouter };
