import {
  ObjectIdToString,
  StringToObjectId,
} from '#root/shared/constants/transformerConstants.js';
import {
  EnrollmentRole,
  EnrollmentStatus,
  ID,
  IEnrollment,
} from '#root/shared/interfaces/models.js';
import {Expose, Transform, Type} from 'class-transformer';
import {ObjectId} from 'mongodb';
import {Progress} from './Progress.js';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

@Expose()
export class Enrollment implements IEnrollment {
  @Expose({ toClassOnly: true })
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Enrollment ID',
    type: 'string',
    example: '64a98c1f2f9e4d3d902db8c1',
  })
  @IsOptional()
  _id?: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '64a98c1f2f9e4d3d902db8c2',
  })
  @IsNotEmpty()
  userId: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Course ID',
    type: 'string',
    example: '64a98c1f2f9e4d3d902db8c3',
  })
  @IsNotEmpty()
  courseId: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Course version ID',
    type: 'string',
    example: '64a98c1f2f9e4d3d902db8c4',
  })
  @IsNotEmpty()
  courseVersionId: ID;

  @Expose()
  @ValidateNested()
  @JSONSchema({
    description: 'User role in the course',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT', 'MANAGER', 'TA', 'STAFF'],
    example: 'STUDENT',
  })
  @IsNotEmpty()
  @IsString()
  role: EnrollmentRole;

  @Expose()
  @ValidateNested()
  @JSONSchema({
    description: 'Enrollment status',
    type: 'string',
    enum: ['ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED'],
    example: 'ACTIVE',
  })
  @IsNotEmpty()
  @IsString()
  status: EnrollmentStatus;

  @Expose()
  @JSONSchema({
    description: 'Enrollment creation timestamp',
    type: 'string',
    format: 'date-time',
    example: '2025-07-01T12:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  enrollmentDate: Date;

  constructor(userId?: string, courseId?: string, courseVersionId?: string) {
    if (userId && courseId && courseVersionId) {
      this.userId = new ObjectId(userId);
      this.courseId = new ObjectId(courseId);
      this.courseVersionId = new ObjectId(courseVersionId);
      this.status = 'ACTIVE';
      this.enrollmentDate = new Date();
    }
  }
}

@Expose({toPlainOnly: true})
export class EnrollUserResponse {
  @Expose()
  @ValidateNested( { each: true} )
  @Type(() => Enrollment)
  @IsNotEmpty()
  enrollment: Enrollment;

  @Expose()
  @Type(() => Progress)
  @ValidateNested( { each: true} )
  @IsNotEmpty()
  progress: Progress;

  @Expose()
  @Type(() => String)
  @ValidateNested()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User Role in Enrollment',
    type: 'string',
    example: 'STUDENT',
  })
  role: EnrollmentRole;

  constructor(
    enrollment: Enrollment,
    progress: Progress,
    role: EnrollmentRole,
  ) {
    this.enrollment = enrollment;
    this.progress = progress;
    this.role = role;
  }
}
export class EnrolledUserResponse {
  @Expose()
  @Type(() => String)
  @JSONSchema({
    description: 'Role assigned to the user in this enrollment',
    type: 'string',
    example: 'STUDENT',
  })
  @IsNotEmpty()
  role: EnrollmentRole;

  @Expose()
  @Type(() => String)
  @JSONSchema({
    description: 'Status of the user in this enrollment',
    type: 'string',
    example: 'ACTIVE',
  })
  @IsNotEmpty()
  status: EnrollmentStatus;

  @Expose()
  @JSONSchema({
    description: 'Timestamp when the enrollment was created',
    type: 'string',
    format: 'date-time',
    example: '2025-07-01T12:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  enrollmentDate: Date;

  constructor(
    role: EnrollmentRole,
    status: EnrollmentStatus,
    enrollmentDate: Date,
  ) {
    this.role = role;
    this.status = status;
    this.enrollmentDate = enrollmentDate;
  }
}
