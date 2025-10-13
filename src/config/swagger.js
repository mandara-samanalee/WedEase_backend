import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wedease API',
      version: '1.0.0',
      description: 'Swagger API documentation for Wedease backend',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', 
      },// Change this to your actual server URL
    ],
  },
  apis: ['./src/routes/**/*.js'], // where Swagger will look
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


