const mockingoose = require('mockingoose');
const mongoose = require('mongoose');

const { getProductById } = require('./productController');
// Import your Mongoose model
const Product = require('./productModel'); // Import the Product model correctly
// import IdSequence from '../general/models/idSequenceModel';

describe('Get a product', () => {
  it('Should return a product', async () => {
    // Mock the findById method of the Product model
    mockingoose(Product).toReturn(
      {
        _id: new mongoose.Types.ObjectId('6525643cb5cff50fd400f8bc'),
        sequenceProductId: 'PRD-00000001',
        name: 'Mock product',
        imageURL:
          'https://res.cloudinary.com/dhhfmbqmx/image/upload/v1695128108/nfixqie269r0qtw7keua.jpg',
        brand: 'Mock brand',
        category: 'Mock category',
        description: 'Mock description',
        numReviews: 0,
        rating: 0,
        price: 33,
        countInStock: 3,
        userId: new mongoose.Types.ObjectId('6525643bb5cff50fd400f8b8'),
        reviews: [],
        createdAt: new Date('2023-10-10T14:48:28.034Z'),
        updatedAt: new Date('2023-10-10T14:48:28.034Z'),
      },
      'findOne'
    );
    const result = getProductById('6525643cb5cff50fd400f8bc');
    // console.log(result);
    expect(result.brand).toBe('Mock brand');
    // expect(getProductById('6525643cb5cff50fd400f8bc'))
  });
});
