import 'reflect-metadata';
import {IsEmpty, IsNotEmpty, IsString, IsMongoId} from 'class-validator';
import {ICourseVersion} from 'shared/interfaces/Models';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * DTO for creating a new course version.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class CreateCourseVersionBody implements Partial<ICourseVersion> {
  /**
   * ID of the course this version belongs to.
   * This is auto-populated and should remain empty in the request body.
   */
  @JSONSchema({
    title: 'Course ID',
    description: 'ID of the course this version belongs to (auto-managed)',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsEmpty()
  courseId?: string;

  /**
   * The version label or identifier (e.g., "v1.0", "Fall 2025").
   */
  @JSONSchema({
    title: 'Version Label',
    description: 'The version label or identifier (e.g., v1.0, Fall 2025)',
    example: 'v1.0',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  version: string;

  /**
   * A brief description of the course version.
   */
  @JSONSchema({
    title: 'Version Description',
    description: 'A brief description of the course version',
    example: 'First release of the course',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

/**
 * Route parameters for creating a course version under a specific course.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class CreateCourseVersionParams {
  /**
   * ID of the course to attach the new version to.
   */
  @JSONSchema({
    title: 'Course ID',
    description: 'ID of the course to attach the new version to',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  id: string;
}

/**
 * Route parameters for reading a course version by ID.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class ReadCourseVersionParams {
  /**
   * ID of the course version to retrieve.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version to retrieve',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  id: string;
}

/**
 * Route parameters for deleting a course version by ID.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class DeleteCourseVersionParams {
  /**
   * ID of the course version to delete.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version to delete',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  /**
   * ID of the course to which the version belongs.
   */
  @JSONSchema({
    title: 'Course ID',
    description: 'ID of the course to which the version belongs',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  courseId: string;
}

/**
 * Response for a single course version data.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class CourseVersionDataResponse {
  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  id: string;

  @JSONSchema({
    description: 'Version name/label',
    example: 'v1.0',
    type: 'string',
    readOnly: true,
  })
  name: string;

  @JSONSchema({
    description: 'Description of the version',
    example: 'First release of the course',
    type: 'string',
    readOnly: true,
  })
  description: string;

  @JSONSchema({
    description: 'ID of the course this version belongs to',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  courseId: string;

  @JSONSchema({
    description: 'Creation timestamp',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  createdAt: Date;

  @JSONSchema({
    description: 'Last update timestamp',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  updatedAt: Date;
}

/**
 * Response for course version not found error.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class CourseVersionNotFoundErrorResponse {
  @JSONSchema({
    description: 'HTTP status code',
    example: 404,
    type: 'integer',
    readOnly: true,
  })
  statusCode: number;

  @JSONSchema({
    description: 'Error message',
    example: 'Course version not found',
    type: 'string',
    readOnly: true,
  })
  message: string;

  @JSONSchema({
    description: 'Error type',
    example: 'Not Found',
    type: 'string',
    readOnly: true,
  })
  error: string;
}

/**
 * Response for course version creation.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class CreateCourseVersionResponse {
  @JSONSchema({
    description: 'The updated course object',
    type: 'object',
    readOnly: true,
  })
  course: Record<string, any>;

  @JSONSchema({
    description: 'The created version object',
    type: 'object',
    readOnly: true,
  })
  version: Record<string, any>;
}

export {
  CreateCourseVersionBody,
  CreateCourseVersionParams,
  ReadCourseVersionParams,
  DeleteCourseVersionParams,
  CourseVersionDataResponse,
  CourseVersionNotFoundErrorResponse,
  CreateCourseVersionResponse,
};
