import express, { Request, Response } from 'express';
import { IdSequence } from '../seqIdModel';
import { ID_SEQUENCE_ORDERS_URL } from '@orbitelco/common';

const router = express.Router();

// @desc    Get next sequence product id for orders
// @route   GET /api/idsequence/v2/orders
// @access  Admin
// @req     <none>
// @res     send({seqId: string})
router.get(ID_SEQUENCE_ORDERS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Sequence']
      #swagger.description = 'Get sequential Order Id'
      #swagger.responses[200] = {
            description: '{ seqId: string }'
      }
    } */
  const seqOrderId = await IdSequence.findOneAndUpdate(
    { sequenceName: 'sequenceOrderId' },
    { $inc: { sequenceCounter: 1 } },
    { returnOriginal: false, upsert: true }
  );
  const sequenceOrderId =
    'ORD-' + seqOrderId.sequenceCounter.toString().padStart(8, '0');
  res.send({ seqId: sequenceOrderId });
});

export { router as getOrderSequenceIdRouter };
