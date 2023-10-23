const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '0.0.1',
    title: 'Orbitelco API',
    description:
      'Specification of APIs belonging to the Orbitelco Backend.  Use /api/users/v1/auth to login and get access to the secure APIs',
  },
  host: 'localhost:5000',
  consumes: ['application/json'],
  produces: ['application/json'],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'cookie',
      description: 'JWT authorization header using HTTP-Only cookies.',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
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
