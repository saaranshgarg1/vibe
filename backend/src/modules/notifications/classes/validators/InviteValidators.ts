import { EnrollmentRole, ObjectIdToString, StringToObjectId } from '#root/shared/index.js';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, ArrayNotEmpty, IsNumber, IsString, IsOptional, IsMongoId, IsNotEmpty, IsEnum, ValidateNested, IsIn } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { ObjectId } from 'mongodb';


class InviteIdParams {
  @JSONSchema({
    description: 'Unique identifier for the invite',
    type: 'string',
  })
  @IsMongoId()
  @IsNotEmpty()
  inviteId: string;
}


class CourseAndVersionId {
  @JSONSchema({
    description: 'ID of the course to which users are being invited',
    type: 'string',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @JSONSchema({
    description: 'ID of the specific version of the course',
    type: 'string',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseVersionId: string;
}

class EmailInvite {
  @JSONSchema({
    description: 'Email address of the user to be invited',
    type: 'string',
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @JSONSchema({
    description: 'Role that the user will have in the course',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT', 'MANAGER', 'TA', 'STAFF'],
    example: 'STUDENT',
  })
  @IsString()
  @IsIn(['INSTRUCTOR', 'STUDENT', 'MANAGER', 'TA', 'STAFF'])
  @IsNotEmpty()
  role: EnrollmentRole;
}


class InviteBody {

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EmailInvite)
  inviteData: EmailInvite[];
}
export type InviteStatus = 'ACCEPTED' | 'PENDING' | 'CANCELLED' | 'EMAIL_FAILED' | 'ALREADY_ENROLLED';

class InviteResult {
  @JSONSchema({
    description: 'Invite ID',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    example: '60c72b2f9b1e8d3f4c8b4567',
  })
  @IsString()
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @IsNotEmpty()
  inviteId: ObjectId | string;

  @JSONSchema({
    description: 'Email of the invited user',
    type: 'string',
    format: 'email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @JSONSchema({
    description: 'Status of the invitation',
    type: 'string',
    enum: ['ACCEPTED', 'PENDING', 'CANCELLED', 'EMAIL_FAILED', 'ALREADY_ENROLLED'],
    example: 'PENDING',
  })
  @IsString()
  @IsNotEmpty()
  inviteStatus: InviteStatus;

  @JSONSchema({
    description: 'Assigned role for the invited user',
    type: 'string',
    enum: ['INSTRUCTOR', 'STUDENT', 'MANAGER', 'TA', 'STAFF'],
    example: 'STUDENT',
  })
  @IsString()
  @IsNotEmpty()
  role: EnrollmentRole = 'STUDENT';

  @IsString()
  @IsOptional()
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @JSONSchema({
    description: 'Course ID related to the invite',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    example: '60c72b2f9b1e8d3f4c8b4567',
  })
  courseId?: string | ObjectId;

  @IsString()
  @IsOptional()
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @JSONSchema({
    description: 'Course version ID related to the invite',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    example: '60c72b2f9b1e8d3f4c8b4567',
  })
  courseVersionId?: string | ObjectId;

  constructor(
    inviteId: ObjectId | string,
    email: string,
    inviteStatus: InviteStatus,
    role: EnrollmentRole = 'STUDENT',
    courseId?: string | ObjectId,
    courseVersionId?: string | ObjectId
  ) {
    this.inviteId = inviteId;
    this.email = email;
    this.inviteStatus = inviteStatus;
    this.role = role;
    this.courseId = courseId;
    this.courseVersionId = courseVersionId;
  }
}

class InviteResponse {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InviteResult)
  @JSONSchema({
    description: 'Array of invite results',
    type: 'array',
    example: [
      {
        inviteId: '60c72b2f9b1e8d3f4c8b4567',
        email: 'user@example.com',
        inviteStatus: 'PENDING',
        role: 'STUDENT',
        courseId: '60c72b2f9b1e8d3f4c8b4567',
        courseVersionId: '60c72b2f9b1e8d3f4c8b4567',
        userId: '60d21b4667d0d8992e610c01'
      }
    ]
  })
  invites: InviteResult[];

  constructor(invites: InviteResult[]) {
    this.invites = invites;
  }
}





export {
  InviteBody,
  CourseAndVersionId,
  InviteResponse, // either one of the response classes depending on your use case
  EmailInvite,
  InviteResult,
  InviteIdParams,
};
