import express, { Request, Response } from 'express';
import { IdSequence } from '../seqIdModel';
import { ID_SEQUENCE_PRODUCTS_URL } from '@orbitelco/common';

const router = express.Router();

// @desc    Get next sequence product id for products
// @route   GET /api/idsequence/v2/products
// @access  Admin
// @req     <none>
// @res     status(200).send(seqId: string)
router.get(ID_SEQUENCE_PRODUCTS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Sequence']
      #swagger.description = 'Get sequential Product Id'
      #swagger.responses[200] = {
            description: '{ seqId: string }'
      }
    } */
  const seqProductId = await IdSequence.findOneAndUpdate(
    { sequenceName: 'sequenceProductId' },
    { $inc: { sequenceCounter: 1 } },
    { returnOriginal: false, upsert: true }
  );
  const sequenceProductId =
    'PRD-' + seqProductId.sequenceCounter.toString().padStart(8, '0');
  res.send({ seqId: sequenceProductId });
});

export { router as getProductSequenceIdRouter };
