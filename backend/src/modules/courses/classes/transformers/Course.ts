import {
  ObjectIdToString,
  StringToObjectId,
  ObjectIdArrayToStringArray,
  StringArrayToObjectIdArray,
} from '#root/shared/constants/transformerConstants.js';
import {ICourse, ID} from '#root/shared/interfaces/models.js';
import { IsDateString, IsOptional, ValidateNested } from 'class-validator';
import {CourseBody} from '../validators/CourseValidators.js';
import {Expose, Type, Transform} from 'class-transformer';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * Course data transformation.
 *
 * @category Courses/Transformers
 */
class Course implements ICourse {
  @Expose()
  @JSONSchema({
    description: 'Unique identifier for the course',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @Transform(ObjectIdToString.transformer, {toPlainOnly: true}) // Convert ObjectId -> string when serializing
  @Transform(StringToObjectId.transformer, {toClassOnly: true}) // Convert string -> ObjectId when deserializing
  @IsOptional()
  _id?: ID;

  @Expose()
  @JSONSchema({
    description: 'Name of the course',
    example: 'Introduction to Programming',
    type: 'string',
  })
  name: string;

  @Expose()
  @JSONSchema({
    description: 'Description of the course',
    example: 'This course covers the basics of programming.',
    type: 'string',
  })
  description: string;

  @Expose()
  @Transform(ObjectIdArrayToStringArray.transformer, {toPlainOnly: true}) // Convert ObjectId[] -> string[] when serializing
  @Transform(StringArrayToObjectIdArray.transformer, {toClassOnly: true}) // Convert string[] -> ObjectId[] when deserializing
  @JSONSchema({
    description: 'List of course version IDs',
    example: ['60d5ec49b3f1c8e4a8f8b8c2', '60d5ec49b3f1c8e4a8f8b8c3'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  versions: ID[];

  @Expose()
  @Transform(ObjectIdArrayToStringArray.transformer, {toPlainOnly: true}) // Convert ObjectId[] -> string[] when serializing
  @Transform(StringArrayToObjectIdArray.transformer, {toClassOnly: true}) // Convert string[] -> ObjectId[] when deserializing
  @JSONSchema({
    description: 'List of instructor IDs associated with the course',
    example: ['60d5ec49b3f1c8e4a8f8b8c4', '60d5ec49b3f1c8e4a8f8b8c5'],
    type: 'array',
    items: {
      type: 'string',
    },
  })
  instructors: ID[];

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Timestamp when the course was created',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt?: Date;

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Timestamp when the course was last updated',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt?: Date;

  constructor(courseBody?: CourseBody) {
    if (courseBody) {
      this.name = courseBody.name;
      this.description = courseBody.description;
    }

    this.versions = [];
    this.instructors = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export {Course};
