import {RoutingControllersOptions, useContainer} from 'routing-controllers';
import {Container} from 'typedi';
import {DocsController} from './controllers/DocsController';

// Set up TypeDI container
useContainer(Container);

export const docsModuleOptions: RoutingControllersOptions = {
  controllers: [DocsController],
  routePrefix: '',
  defaultErrorHandler: true,
};

export * from './controllers/DocsController';
