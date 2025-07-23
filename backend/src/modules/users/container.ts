﻿import {ContainerModule} from 'inversify';
import {USERS_TYPES} from './types.js';
import {EnrollmentRepository} from '#root/shared/database/providers/mongo/repositories/EnrollmentRepository.js';
import {ProgressRepository} from '#root/shared/database/providers/mongo/repositories/ProgressRepository.js';
import {EnrollmentController} from './controllers/EnrollmentController.js';
import {ProgressController} from './controllers/ProgressController.js';
import {UserController} from './controllers/UserController.js';
import {EnrollmentService} from './services/EnrollmentService.js';
import {ProgressService} from './services/ProgressService.js';
import {UserService} from './services/UserService.js';

export const usersContainerModule = new ContainerModule(options => {
  // Repositories
  options
    .bind(USERS_TYPES.ProgressRepo)
    .to(ProgressRepository)
    .inSingletonScope();
  options
    .bind(USERS_TYPES.EnrollmentRepo)
    .to(EnrollmentRepository)
    .inSingletonScope();

  // Services
  options
    .bind(USERS_TYPES.EnrollmentService)
    .to(EnrollmentService)
    .inSingletonScope();
  options
    .bind(USERS_TYPES.ProgressService)
    .to(ProgressService)
    .inSingletonScope();
  options
    .bind(USERS_TYPES.UserService)
    .to(UserService)
    .inSingletonScope();

  // Controllers
  options.bind(ProgressController).toSelf().inSingletonScope();
  options.bind(EnrollmentController).toSelf().inSingletonScope();
  options.bind(UserController).toSelf().inSingletonScope();
});
