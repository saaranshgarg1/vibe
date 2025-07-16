import {Type} from 'class-transformer';
import {
  IsMongoId,
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsInt,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {ProgressDataResponse} from './ProgressValidators.js';
import {
  EnrollmentRole,
  EnrollmentStatus,
  ID,
} from '#root/shared/interfaces/models.js';
import { User } from '#root/modules/auth/classes/index.js';

export class EnrollmentParams {
  @JSONSchema({
    description: 'User ID of the student to enroll',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @JSONSchema({
    description: 'ID of the course to enroll in',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @JSONSchema({
    description: 'ID of the specific course version to enroll in',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  versionId: string;
}

export class EnrollmentBody {
  @JSONSchema({
    description: 'Role of the user',
    example: 'INSTRUCTOR',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT'],
  })
  @IsEnum(['INSTRUCTOR', 'STUDENT', 'MANAGER', 'TA', 'STAFF'])
  @IsNotEmpty()
  role: EnrollmentRole;
}
  
export class EnrollmentDataResponse {
  @JSONSchema({
    description: 'Unique identifier for the enrollment record',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    readOnly: true,
  })
  @IsString()
  @IsMongoId()
  _id?: ID;


  @JSONSchema({
    description: 'User object associated with this enrollment',
    type: 'object'
  })
  @Type(() => User)
  @ValidateNested( {each: true} )
  user?:User

  @JSONSchema({
    description: 'User ID associated with this enrollment',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: ID;

  @JSONSchema({
    description: 'Course ID associated with this enrollment',
    example: '60d5ec49b3f1c8e4a8f8b8c2',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: ID;

  @JSONSchema({
    description: 'Course version ID associated with this enrollment',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseVersionId: ID;

  @JSONSchema({
    description: 'Role of the user',
    example: 'INSTRUCTOR',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT'],
  })
  @IsNotEmpty()
  @IsString()
  role: EnrollmentRole;

  @JSONSchema({
    description: 'Status of the enrollment',
    example: 'active',
    type: 'string',
    enum: ['active', 'inactive'],
  })
  @IsNotEmpty()
  @IsString()
  status: EnrollmentStatus;

  @JSONSchema({
    description: 'Date when the user was enrolled',
    example: '2023-10-01T12:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  enrollmentDate: Date;
}

export class EnrollUserResponseData {
  @JSONSchema({
    description: 'Enrollment data for the user',
    type: 'object'
  })
  @ValidateNested()
  @Type(() => EnrollmentDataResponse)
  @IsNotEmpty()
  enrollment: EnrollmentDataResponse;

  @JSONSchema({
    description: 'Progress data for the user',
    type: 'object'
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ProgressDataResponse)
  progress: ProgressDataResponse;
}

export class EnrolledUserResponseData {
  @JSONSchema({
    description: 'Role of the user in the course',
    example: 'INSTRUCTOR',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT'],
  })
  @IsNotEmpty()
  role: EnrollmentRole;

  @JSONSchema({
    description: 'Status of the enrollment',
    example: 'active',
    type: 'string',
    enum: ['active', 'inactive'],
  })
  @IsNotEmpty()
  status: EnrollmentStatus;

  @JSONSchema({
    description: 'Date when the user was enrolled',
    example: '2023-10-01T12:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  enrollmentDate: Date;
}

export class EnrollmentResponse {
  @JSONSchema({
    description: 'Total number of enrollment records available across all pages.',
    example: 100,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  totalDocuments: number;

  @JSONSchema({
    description: 'Total number of pages based on the current pagination settings.',
    example: 10,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  totalPages: number;

  @JSONSchema({
    description: 'The current page number of the paginated enrollment response.',
    example: 1,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  currentPage: number;

  @JSONSchema({
    description: 'List of enrollment records for the current page.',
    type: 'array',
    items: { $ref: '#/components/schemas/EnrollmentDataResponse' },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnrollmentDataResponse)
  enrollments: EnrollmentDataResponse[];
}

export class CourseVersionEnrollmentResponse {
  @JSONSchema({
    description: 'Array of enrollment data for the course version',
    type: 'array',
    items: { $ref: '#/components/schemas/EnrollmentDataResponse' },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => EnrollmentDataResponse)
  enrollments: EnrollmentDataResponse[];
}

export class EnrollmentNotFoundErrorResponse {
  @JSONSchema({
    description: 'Error message indicating the enrollment was not found',
    example: 'Enrollment could not be created or found.',
  })
  @IsString()
  message: string;
}

export const ENROLLMENT_VALIDATORS = [
  EnrollUserResponseData,
  EnrolledUserResponseData,
  EnrollmentBody,
  EnrollmentParams,
  EnrollmentDataResponse,
  EnrollmentResponse,
  EnrollmentNotFoundErrorResponse
]