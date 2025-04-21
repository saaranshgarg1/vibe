import {useContainer} from 'routing-controllers';
import {RoutingControllersOptions} from 'routing-controllers';
import {Container} from 'typedi';
import {MongoDatabase} from 'shared/database/providers/mongo/MongoDatabase';
import {EnrollmentRepository} from 'shared/database/providers/mongo/repositories/EnrollmentRepository';
import {CourseRepository} from 'shared/database/providers/mongo/repositories/CourseRepository';
import {EnrollmentController} from './controllers/EnrollmentController';

useContainer(Container);

if (!Container.has('EnrollmentRepo')) {
  Container.set(
    'EnrollmentRepo',
    new EnrollmentRepository(Container.get<MongoDatabase>('Database')),
  );
}

// Make sure course repository is registered
if (!Container.has('NewCourseRepo')) {
  Container.set(
    'NewCourseRepo',
    new CourseRepository(Container.get<MongoDatabase>('Database')),
  );
}

export const usersModuleOptions: RoutingControllersOptions = {
  controllers: [EnrollmentController],
  authorizationChecker: async function () {
    return true;
  },
  validation: true,
  routePrefix: '/api',
};

export * from './classes/validators/index';
export * from './classes/transformers/index';
export * from './controllers/index';

export {EnrollmentController};
