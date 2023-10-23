const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_outpout.json';
const endpointsFiles = ['./routes/*.js'];

const config = {
  info: {
    title: 'Orbitelco API Documentation',
    description: '',
  },
  tags: [],
  host: 'localhost:3000/api',
  schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);
