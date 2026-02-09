import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBoard API',
      version: '1.0.0',
      description: 'API documentation for SmartBoard - A collaborative board management system with AI-powered recommendations',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
          },
        },
        Board: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Board ID',
            },
            title: {
              type: 'string',
              description: 'Board title',
            },
            description: {
              type: 'string',
              description: 'Board description',
            },
            owner: {
              type: 'string',
              description: 'User ID of board owner',
            },
            members: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of member user IDs',
            },
          },
        },
        List: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'List ID',
            },
            title: {
              type: 'string',
              description: 'List title',
            },
            board: {
              type: 'string',
              description: 'Board ID',
            },
            position: {
              type: 'number',
              description: 'List position',
            },
          },
        },
        Card: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Card ID',
            },
            title: {
              type: 'string',
              description: 'Card title',
            },
            description: {
              type: 'string',
              description: 'Card description',
            },
            list: {
              type: 'string',
              description: 'List ID',
            },
            position: {
              type: 'number',
              description: 'Card position',
            },
            assignedTo: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array of assigned user IDs',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
