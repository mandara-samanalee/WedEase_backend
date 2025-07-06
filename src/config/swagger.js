import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedease API',
      version: '1.0.0',
      description: 'API documentation for Wedease backend',
    },
    servers: [
      {
        url: 'http://localhost3000', 
      },
    ],
  },
  apis: ['./src/routes/**/*.js'], // where Swagger will look
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
