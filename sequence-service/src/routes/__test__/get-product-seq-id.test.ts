import request from 'supertest';
import { app } from '../../app';
import { ID_SEQUENCE_URL, ID_SEQUENCE_PRODUCTS_URL } from '@orbitelco/common';
import { fakeSignupAdmin } from '../../test/helper-functions';
import { IdSequence } from '../../seqIdModel';

describe('Test get sequence id for products', () => {
  it('returns a status 200 and the next sequence id for a new product', async () => {
    // Create entry for product sequence id
    await request(app)
      .post(ID_SEQUENCE_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({
        sequenceName: 'sequenceProductId',
      })
      .expect(201);

    // Check that the sequence record table contains one record
    const sequenceRecords = await IdSequence.find({});
    expect(sequenceRecords.length).toEqual(1);
    expect(sequenceRecords[0].sequenceName).toEqual('sequenceProductId');

    // get next sequence id
    const resSeqId = await request(app)
      .get(ID_SEQUENCE_PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send();
    expect(resSeqId.status).toEqual(200);
    expect(resSeqId.body.seqId).toEqual('PRD-00000001');

    // get next sequence id
    const resSeqId2 = await request(app)
      .get(ID_SEQUENCE_PRODUCTS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send();
    expect(resSeqId2.status).toEqual(200);
    expect(resSeqId2.body.seqId).toEqual('PRD-00000002');
  });
});
