import {ICourse, ID} from '#root/shared/interfaces/models.js';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateIf,
  IsMongoId,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';

class CourseBody implements Partial<ICourse> {
  @JSONSchema({
    description: 'Name of the course',
    example: 'Introduction to Programming',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  name: string;

  @JSONSchema({
    description: 'Description of the course',
    example: 'This course covers the basics of programming.',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;
}

class CourseIdParams {
  @JSONSchema({
    description: 'Object ID of the course',
    type: 'string',
  })
  @IsMongoId()
  @IsString()
  courseId: string;
}

class CourseDataResponse implements ICourse {
  @JSONSchema({
    description: 'Course ID',
    type: 'string',
    readOnly: true,
  })
  @IsOptional()
  _id?: ID;

  @JSONSchema({
    description: 'Course name',
    example: 'Introduction to Programming',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @JSONSchema({
    description: 'Course description',
    example: 'This course covers the basics of programming.',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @JSONSchema({
    description: 'Version IDs',
    example: ['60d5ec49b3f1c8e4a8f8b8c2'],
    type: 'array',
    readOnly: true,
    items: { type: 'string' },
  })
  @IsNotEmpty()
  versions: ID[];

  @JSONSchema({
    description: 'Instructor IDs',
    example: ['60d5ec49b3f1c8e4a8f8b8c4'],
    type: 'array',
    readOnly: true,
    items: { type: 'string' },
  })
  @IsNotEmpty()
  instructors: ID[];

  @JSONSchema({
    description: 'Created timestamp',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsNotEmpty()
  createdAt?: Date | null;

  @JSONSchema({
    description: 'Last updated timestamp',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsNotEmpty()
  updatedAt?: Date | null;
}

class CourseNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message.',
    example:
      'No course found with the specified ID. Please verify the ID and try again.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

export {
  CourseBody,
  CourseIdParams,
  CourseDataResponse,
  CourseNotFoundErrorResponse,
};

export const COURSE_VALIDATORS = [
  CourseBody,
  CourseIdParams,
  CourseDataResponse,
  CourseNotFoundErrorResponse,
]