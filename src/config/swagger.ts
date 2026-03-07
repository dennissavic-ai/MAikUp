export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MAikUp API',
    version: '1.0.0',
    description:
      'Virtual Makeup & Hairstyle Try-On Platform Backend API. Provides endpoints for browsing makeup products, hairstyles, AR try-on assets, user favorites, curated looks, sharing, analytics, and admin management.',
    contact: {
      name: 'MAikUp Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Health', description: 'Health check' },
    { name: 'Auth', description: 'Authentication via Firebase' },
    { name: 'Subscription', description: 'Stripe subscription management' },
    { name: 'Makeup', description: 'Makeup products, categories, finishes, and curated looks' },
    { name: 'Hairstyles', description: 'Hairstyle catalog and filtering' },
    { name: 'Favorites', description: 'User favorites management' },
    { name: 'Looks', description: 'User-created custom looks' },
    { name: 'Sharing', description: 'Social sharing of looks and try-ons' },
    { name: 'AR Assets', description: 'Augmented reality asset bundles' },
    { name: 'Search', description: 'Unified search across products and hairstyles' },
    { name: 'Trending', description: 'Featured and trending content' },
    { name: 'Analytics', description: 'Usage analytics and event tracking' },
    { name: 'Uploads', description: 'File uploads via presigned S3 URLs' },
    { name: 'Notifications', description: 'Push notification management' },
    { name: 'Admin', description: 'Admin dashboard and management' },
    { name: 'Try-On', description: 'Virtual try-on session management' },
  ],
  paths: {
    // ─── Health ─────────────────────────────────────────────────
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
          },
        },
      },
    },

    // ─── Auth ───────────────────────────────────────────────────
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register or sync a Firebase user',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  displayName: { type: 'string' },
                  photoUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User registered/synced', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current authenticated user',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Current user data', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Subscription ───────────────────────────────────────────
    '/api/subscription/plans': {
      get: {
        tags: ['Subscription'],
        summary: 'Get available subscription plans',
        responses: {
          200: { description: 'List of plans', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/api/subscription/checkout': {
      post: {
        tags: ['Subscription'],
        summary: 'Create a Stripe checkout session',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['priceId'],
                properties: {
                  priceId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Checkout session URL', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Makeup ─────────────────────────────────────────────────
    '/api/makeup/categories': {
      get: {
        tags: ['Makeup'],
        summary: 'Get all makeup categories and subcategories',
        responses: {
          200: { description: 'Categories grouped by name', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/api/makeup/finishes': {
      get: {
        tags: ['Makeup'],
        summary: 'Get available makeup finishes',
        responses: {
          200: { description: 'List of finishes with counts', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },
    '/api/makeup/products': {
      get: {
        tags: ['Makeup'],
        summary: 'Get makeup products with filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'subcategory', in: 'query', schema: { type: 'string' } },
          { name: 'finish', in: 'query', schema: { type: 'string' } },
          { name: 'tier', in: 'query', schema: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'tags', in: 'query', schema: { type: 'string', description: 'Comma-separated tags' } },
        ],
        responses: {
          200: { description: 'Paginated products', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
        },
      },
    },
    '/api/makeup/products/{id}': {
      get: {
        tags: ['Makeup'],
        summary: 'Get a single makeup product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Product details', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          404: { description: 'Product not found' },
        },
      },
    },
    '/api/makeup/looks': {
      get: {
        tags: ['Makeup'],
        summary: 'Get predefined makeup looks with filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'style', in: 'query', schema: { type: 'string' } },
          { name: 'occasion', in: 'query', schema: { type: 'string' } },
          { name: 'difficulty', in: 'query', schema: { type: 'string' } },
          { name: 'tier', in: 'query', schema: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated looks', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
        },
      },
    },
    '/api/makeup/looks/{id}': {
      get: {
        tags: ['Makeup'],
        summary: 'Get a single makeup look with products',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Look details with products', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          404: { description: 'Look not found' },
        },
      },
    },

    // ─── Hairstyles ─────────────────────────────────────────────
    '/api/hairstyles': {
      get: {
        tags: ['Hairstyles'],
        summary: 'Get hairstyles with filtering',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'length', in: 'query', schema: { type: 'string' } },
          { name: 'tier', in: 'query', schema: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated hairstyles', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
        },
      },
    },
    '/api/hairstyles/{id}': {
      get: {
        tags: ['Hairstyles'],
        summary: 'Get a single hairstyle',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Hairstyle details', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          404: { description: 'Hairstyle not found' },
        },
      },
    },

    // ─── Favorites ──────────────────────────────────────────────
    '/api/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Get user favorites',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['makeup_product', 'hairstyle', 'makeup_look'] } },
        ],
        responses: {
          200: { description: 'User favorites', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Favorites'],
        summary: 'Add a favorite',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['entityType', 'entityId'],
                properties: {
                  entityType: { type: 'string', enum: ['makeup_product', 'hairstyle', 'makeup_look'] },
                  entityId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Favorite added', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/favorites/{id}': {
      delete: {
        tags: ['Favorites'],
        summary: 'Remove a favorite',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Favorite removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Looks ──────────────────────────────────────────────────
    '/api/looks': {
      get: {
        tags: ['Looks'],
        summary: 'Get user-created looks',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User looks', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Looks'],
        summary: 'Create a custom look',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  products: { type: 'array', items: { type: 'object', properties: { productId: { type: 'string' }, settings: { type: 'object' } } } },
                  hairstyleId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Look created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Sharing ────────────────────────────────────────────────
    '/api/sharing': {
      post: {
        tags: ['Sharing'],
        summary: 'Create a share link',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['entityType', 'entityId'],
                properties: {
                  entityType: { type: 'string' },
                  entityId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Share link created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/sharing/{token}': {
      get: {
        tags: ['Sharing'],
        summary: 'Access shared content by token',
        parameters: [{ name: 'token', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Shared content', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          404: { description: 'Share not found or expired' },
        },
      },
    },

    // ─── AR Assets ──────────────────────────────────────────────
    '/api/ar/assets': {
      get: {
        tags: ['AR Assets'],
        summary: 'Get AR asset bundles',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'AR assets', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
        },
      },
    },
    '/api/ar/assets/{id}': {
      get: {
        tags: ['AR Assets'],
        summary: 'Get a single AR asset',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'AR asset details', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          404: { description: 'Asset not found' },
        },
      },
    },

    // ─── Search ─────────────────────────────────────────────────
    '/api/search': {
      get: {
        tags: ['Search'],
        summary: 'Unified search across products and hairstyles',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['all', 'products', 'hairstyles', 'looks'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Search results', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },

    // ─── Trending ───────────────────────────────────────────────
    '/api/trending': {
      get: {
        tags: ['Trending'],
        summary: 'Get featured/trending content for home screen',
        parameters: [
          { name: 'section', in: 'query', schema: { type: 'string' }, description: 'Filter by section name' },
        ],
        responses: {
          200: { description: 'Featured items grouped by section', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
      post: {
        tags: ['Trending'],
        summary: 'Create a featured item (admin)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/FeaturedItem' },
            },
          },
        },
        responses: {
          201: { description: 'Featured item created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/trending/auto': {
      get: {
        tags: ['Trending'],
        summary: 'Get auto-generated trending content based on analytics',
        responses: {
          200: { description: 'Trending products, looks, and hairstyles with scores', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
        },
      },
    },

    // ─── Analytics ──────────────────────────────────────────────
    '/api/analytics/events': {
      post: {
        tags: ['Analytics'],
        summary: 'Track an analytics event',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['eventType'],
                properties: {
                  eventType: { type: 'string' },
                  entityType: { type: 'string' },
                  entityId: { type: 'string' },
                  metadata: { type: 'object' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Event tracked', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Uploads ────────────────────────────────────────────────
    '/api/uploads/presigned-url': {
      post: {
        tags: ['Uploads'],
        summary: 'Get a presigned S3 upload URL',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fileName', 'contentType'],
                properties: {
                  fileName: { type: 'string' },
                  contentType: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Presigned URL and key', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Notifications ──────────────────────────────────────────
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Paginated notifications', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/notifications/register': {
      post: {
        tags: ['Notifications'],
        summary: 'Register a push notification token',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'platform'],
                properties: {
                  token: { type: 'string' },
                  platform: { type: 'string', enum: ['ios', 'android'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Token registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ─── Admin ──────────────────────────────────────────────────
    '/api/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get platform statistics',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Platform stats', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - admin only' },
        },
      },
    },
    '/api/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'Get all users (admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Paginated users', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden - admin only' },
        },
      },
    },

    // ─── Try-On ─────────────────────────────────────────────────
    '/api/try-on/sessions': {
      post: {
        tags: ['Try-On'],
        summary: 'Start a virtual try-on session',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  photoUrl: { type: 'string' },
                  products: { type: 'array', items: { type: 'string' } },
                  hairstyleId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Try-on session created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http' as const,
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase ID token',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'object', nullable: true },
          message: { type: 'string' },
          error: { type: 'string' },
        },
        required: ['success'],
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              limit: { type: 'integer' },
              total: { type: 'integer' },
              totalPages: { type: 'integer' },
            },
          },
        },
        required: ['success', 'data', 'pagination'],
      },
      MakeupProduct: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          subcategory: { type: 'string' },
          colorName: { type: 'string' },
          colorHex: { type: 'string' },
          finish: { type: 'string', nullable: true },
          tier: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] },
          thumbnailUrl: { type: 'string' },
          arAssetUrl: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          sortOrder: { type: 'integer' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Hairstyle: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          length: { type: 'string' },
          tier: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] },
          thumbnailUrl: { type: 'string' },
          arAssetUrl: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MakeupLook: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          style: { type: 'string' },
          occasion: { type: 'string' },
          difficulty: { type: 'string' },
          tier: { type: 'string', enum: ['FREE', 'BASIC', 'PREMIUM'] },
          thumbnailUrl: { type: 'string' },
          products: { type: 'array', items: { type: 'object' } },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ArAsset: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string' },
          bundleUrl: { type: 'string' },
          version: { type: 'string' },
          fileSizeBytes: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      FeaturedItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          section: { type: 'string' },
          title: { type: 'string' },
          subtitle: { type: 'string' },
          imageUrl: { type: 'string' },
          linkType: { type: 'string' },
          linkId: { type: 'string' },
          position: { type: 'integer' },
          isActive: { type: 'boolean' },
          startDate: { type: 'string', format: 'date-time', nullable: true },
          endDate: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
