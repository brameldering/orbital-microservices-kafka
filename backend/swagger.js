const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '0.0.1',
    title: 'Orbital API',
    description: 'Specification of APIs belonging to the Orbital Backend',
  },
  host: 'localhost:5000',
  consumes: ['application/json'],
  produces: ['application/json'],
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './config/configRoutes.ts',
  './product/productRoutes.ts',
  './product/uploadImageRoutes.ts',
  './user/userRoutes.ts',
  './order/orderRoutes.ts',
];

swaggerAutogen(outputFile, endpointsFiles, doc);
