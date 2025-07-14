import { Expose, Transform, Type } from 'class-transformer';
import { CreateCourseVersionBody } from '../validators/CourseVersionValidators.js';
import {
  ObjectIdToString,
  StringToObjectId,
} from '#root/shared/constants/transformerConstants.js';
import { ICourseVersion, ID } from '#root/shared/interfaces/models.js';
import { Module } from './Module.js';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Course version data transformation.
 *
 * @category Courses/Transformers
 */
class CourseVersion implements ICourseVersion {
  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Course version ID',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsOptional()
  _id?: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Associated course ID',
    example: '60d5ec49b3f1c8e4a8f8b8c2',
    type: 'string',
  })
  @IsNotEmpty()
  courseId: ID;

  @Expose()
  @JSONSchema({
    description: 'Version label',
    example: 'v1.0.0',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @Expose()
  @JSONSchema({
    description: 'Version summary',
    example: 'Initial release of course materials.',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @Type(() => Module)
  @ValidateNested({ each: true })
  @JSONSchema({
    description: 'Modules in this version',
    type: 'array',
    items: { $ref: '#/components/schemas/Module' }
  })
  @IsNotEmpty()
  modules: Module[];

  @Expose()
  @Type(() => Number)
  totalItems?: number;

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Created on',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T12:00:00.000Z',
  })
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Last updated on',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T15:30:00.000Z',
  })
  @IsNotEmpty()
  updatedAt: Date;

  constructor(courseVersionBody?: CreateCourseVersionBody) {
    if (courseVersionBody) {
      this.version = courseVersionBody.version;
      this.description = courseVersionBody.description;
    }
    this.modules = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export { CourseVersion };
