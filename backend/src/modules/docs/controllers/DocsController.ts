import {Controller, Get, Req, Res} from 'routing-controllers';
import {apiReference} from '@scalar/express-api-reference';
import {Service} from 'typedi';
import {Request, Response} from 'express';
import 'reflect-metadata';
import {getMetadataArgsStorage} from 'routing-controllers';
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';

// Import module options
import {authModuleOptions} from '../../auth';
import {coursesModuleOptions} from '../../courses';
import {usersModuleOptions} from '../../users';
import {docsModuleOptions} from '../../docs';

@Service()
@Controller()
export class DocsController {
  private generateOpenAPISpec() {
    // Get validation schemas
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
      validationError: {
        target: true,
        value: true,
      },
    });

    // Get metadata storage
    const storage = getMetadataArgsStorage();

    // Combine all controllers from different modules
    const allControllers = [
      ...(authModuleOptions.controllers || []),
      ...(coursesModuleOptions.controllers || []),
      ...(usersModuleOptions.controllers || []),
      ...(docsModuleOptions.controllers || []),
    ];

    // Create combined routing-controllers options
    const routingControllersOptions = {
      controllers: allControllers as Function[], // Type assertion to Function[]
      validation: true,
      routePrefix: '/api',
    };

    // Create OpenAPI specification
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      info: {
        title: 'ViBe API Documentation',
        version: '1.0.0',
        description: 'API documentation for the ViBe platform',
        contact: {
          name: 'ViBe Team',
          email: 'support@vibe.com',
        },
      },
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      servers: [
        {
          url: 'http://localhost:4001/api',
          description: 'Development server',
        },
        {
          url: 'https://api.vibe.com',
          description: 'Production server',
        },
      ],
      security: [
        {
          bearerAuth: [],
        },
      ],
    });

    return spec;
  }

  @Get('/docs')
  getDocs(@Req() req: Request, @Res() res: Response): void {
    try {
      // Generate OpenAPI spec dynamically
      const openApiSpec = this.generateOpenAPISpec();

      // Create the Scalar handler with the dynamically generated spec
      const handler = apiReference({
        spec: {
          content: openApiSpec,
        },
        theme: {
          title: 'ViBe API Documentation',
          primaryColor: '#3B82F6',
        },
      });

      // Call the handler to render the documentation
      handler(req, res);
    } catch (error) {
      console.error('Error serving API documentation:', error);
      res
        .status(500)
        .send(`Failed to load API documentation: ${error.message}`);
    }
  }
}
