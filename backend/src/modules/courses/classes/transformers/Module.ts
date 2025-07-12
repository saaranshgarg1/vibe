import { calculateNewOrder } from '#courses/utils/calculateNewOrder.js';

import { Expose, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

import { CreateModuleBody } from '../validators/ModuleValidators.js';
import { Section } from './Section.js';
import {
  ObjectIdToString,
  StringToObjectId,
} from '#root/shared/constants/transformerConstants.js';
import { IModule, ID } from '#root/shared/interfaces/models.js';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Module data transformation.
 *
 * @category Courses/Transformers
 */
class Module implements IModule {
  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Module ID',
    example: '60e5ac43b3a1b0d1f8c7a8d2',
    type: 'string',
  })
  @IsOptional()
  moduleId?: ID;

  @Expose()
  @JSONSchema({
    description: 'Module name',
    example: 'Introduction to JavaScript',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @JSONSchema({
    description: 'Module overview',
    example: 'This module introduces the basics of JavaScript programming.',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @JSONSchema({
    description: 'Module order key',
    example: '001-002',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  order: string;

  @Expose()
  @Type(() => Section)
  @ValidateNested({ each: true })
  @JSONSchema({
    description: 'Sections under this module',
    type: 'array',
    items: { $ref: '#/components/schemas/Section' },
  })
  @IsNotEmpty()
  sections: Section[];

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Created on',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T10:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Last updated on',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T12:00:00.000Z',
  })
  updatedAt: Date;

  constructor(moduleBody: CreateModuleBody, existingModules: IModule[]) {
    if (moduleBody) {
      this.name = moduleBody.name;
      this.description = moduleBody.description;
    }
    const sortedModules = existingModules.sort((a, b) =>
      a.order.localeCompare(b.order),
    );
    this.moduleId = new ObjectId();
    this.order = calculateNewOrder(
      sortedModules,
      'moduleId',
      moduleBody.afterModuleId,
      moduleBody.beforeModuleId,
    );
    this.sections = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export { Module };
