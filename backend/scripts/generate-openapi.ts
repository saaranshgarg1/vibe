require('reflect-metadata');
const {getMetadataArgsStorage} = require('routing-controllers');
const {routingControllersToSpec} = require('routing-controllers-openapi');
const {validationMetadatasToSchemas} = require('class-validator-jsonschema');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const outputToStdout = args.includes('--stdout');

// Import module options using require
const {authModuleOptions} = require('../src/modules/auth');
const {coursesModuleOptions} = require('../src/modules/courses');
const {usersModuleOptions} = require('../src/modules/users');
const {docsModuleOptions} = require('../src/modules/docs');

// Create combined metadata for OpenAPI
const generateOpenAPISpec = () => {
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
    controllers: allControllers,
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
};

// Execute and save the OpenAPI specification
const outputDir = path.resolve(__dirname, '../openapi');
const openApiSpec = generateOpenAPISpec();

if (outputToStdout) {
  // Output to console
  console.log(JSON.stringify(openApiSpec, null, 2));
} else {
  // Output to file
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }

  const outputPath = path.join(outputDir, 'openapi.json');
  try {
    fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));
    console.log(`✨ OpenAPI specification generated at: ${outputPath}`);
  } catch (error) {
    console.error('Error writing OpenAPI specification to file:', error);
    throw error;
  }
}
