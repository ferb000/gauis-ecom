import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Grocery Store',
      version: '1.0.0',
      description: 'Complete API documentation for Grocery Store with all endpoints, request/response schemas, and examples',
      contact: {
        name: 'API Support',
        
      },
    },
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            ok: {
              type: 'boolean',
              example: true,
            },
          },
        },
        RequestOtpRequest: {
          type: 'object',
          required: ['phone_number'],
          properties: {
            phone_number: {
              type: 'string',
              example: '+2348012345678',
              description: 'User phone number with country code',
            },
          },
        },
        RequestOtpResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'OTP sent',
            },
            expires_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z',
            },
            dev_otp: {
              type: 'string',
              example: '123456',
              description: 'Only in development environment',
            },
          },
        },
        VerifyOtpRequest: {
          type: 'object',
          required: ['phone_number', 'otp'],
          properties: {
            phone_number: {
              type: 'string',
              example: '+2348012345678',
            },
            otp: {
              type: 'string',
              example: '123456',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'user_123',
            },
            phone_number: {
              type: 'string',
              example: '+2348012345678',
            },
            email: {
              type: 'string',
              example: 'user@example.com',
            },
            first_name: {
              type: 'string',
              example: 'John',
            },
            last_name: {
              type: 'string',
              example: 'Doe',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        VerifyOtpResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Phone verified',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              description: 'JWT authentication token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        Address: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'addr_123',
            },
            user_id: {
              type: 'string',
            },
            street: {
              type: 'string',
              example: '123 Main Street',
            },
            city: {
              type: 'string',
              example: 'Lagos',
            },
            state: {
              type: 'string',
              example: 'Lagos',
            },
            postal_code: {
              type: 'string',
              example: '101241',
            },
            country: {
              type: 'string',
              example: 'Nigeria',
            },
            is_default: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cat_123',
            },
            name: {
              type: 'string',
              example: 'Electronics',
            },
            description: {
              type: 'string',
              example: 'Electronic devices and accessories',
            },
            image_url: {
              type: 'string',
              example: 'https://example.com/images/electronics.jpg',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'prod_123',
            },
            name: {
              type: 'string',
              example: 'Wireless Headphones',
            },
            description: {
              type: 'string',
              example: 'Premium wireless headphones with noise cancellation',
            },
            price: {
              type: 'number',
              format: 'float',
              example: 15999.99,
            },
            category_id: {
              type: 'string',
            },
            stock: {
              type: 'integer',
              example: 50,
            },
            image_url: {
              type: 'string',
              example: 'https://example.com/images/headphones.jpg',
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'cart_item_123',
            },
            product_id: {
              type: 'string',
            },
            quantity: {
              type: 'integer',
              example: 2,
            },
            price: {
              type: 'number',
              format: 'float',
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'order_123',
            },
            user_id: {
              type: 'string',
            },
            total_amount: {
              type: 'number',
              format: 'float',
              example: 31999.98,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              example: 'pending',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
      {
        name: 'Authentication',
        description: 'OTP-based authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User profile management endpoints',
      },
      {
        name: 'Addresses',
        description: 'User address management endpoints',
      },
      {
        name: 'Categories',
        description: 'Product category endpoints',
      },
      {
        name: 'Products',
        description: 'Product catalog endpoints',
      },
      {
        name: 'Inventory',
        description: 'Inventory management endpoints',
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints',
      },
      {
        name: 'Checkout',
        description: 'Checkout and payment endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
    ],
  },
  apis: ['./src/modules/*/*.routes.js', './src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
