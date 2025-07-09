import {ID, IProgress} from '#root/shared/interfaces/models.js';
import {Expose} from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  ValidateIf,
  IsBoolean,
  IsNumber,
  IsDateString,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import { WatchTime } from '../transformers/WatchTime.js';

export class GetUserProgressParams {
  @JSONSchema({
    description: 'User ID to retrieve progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Course ID to retrieve progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to retrieve progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export class StartItemBody {
  @JSONSchema({
    description: 'ID of the course item to start',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  itemId: string;

  @JSONSchema({
    description: 'ID of the module containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  moduleId: string;

  @JSONSchema({
    description: 'ID of the section containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  sectionId: string;
}

export class StartItemParams {
  @JSONSchema({
    description: 'User ID to track progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Course ID to track progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to track progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export class StartItemResponse {
  @Expose()
  @JSONSchema({
    description: 'Watch item ID for tracking progress',
    example: '60d5ec49b3f1c8e4a8f8b8c7',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  watchItemId: string;

  constructor(data: Partial<StartItemResponse>) {
    Object.assign(this, data);
  }
}

export class StopItemParams {
  @JSONSchema({
    description: 'User ID to stop tracking progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Course ID to stop tracking progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to stop tracking progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export class StopItemBody {
  @JSONSchema({
    description: 'Watch item ID used for tracking progress',
    example: '60d5ec49b3f1c8e4a8f8b8c7',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  watchItemId: string;

  @JSONSchema({
    description: 'ID of the course item to stop tracking',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  itemId: string;

  @JSONSchema({
    description: 'ID of the section containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  sectionId: string;

  @JSONSchema({
    description: 'ID of the module containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  moduleId: string;

  @JSONSchema({
    description: 'Attempt ID for quiz tracking',
    example: '60d5ec49b3f1c8e4a8f8b8c7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  attemptId?: string;
}

export class UpdateProgressBody {
  @JSONSchema({
    description: 'ID of the module to update progress for',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  moduleId: string;

  @JSONSchema({
    description: 'ID of the section to update progress for',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  sectionId: string;

  @JSONSchema({
    description: 'ID of the item to update progress for',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  itemId: string;

  @JSONSchema({
    description: 'Watch item ID used for tracking progress',
    example: '60d5ec49b3f1c8e4a8f8b8c7',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  watchItemId?: string;

  @JSONSchema({
    description: 'ID of the attempt for quiz',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  attemptId?: string;
}

export class UpdateProgressParams {
  @JSONSchema({
    description: 'User ID to update progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Course ID to update progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to update progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export class WatchTimeResponse {
  @JSONSchema({
    description: 'Unique identifier for the watch time record',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  _id?: string;

  @JSONSchema({
    description: 'User ID to track watch time for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: ID;

  @JSONSchema({
    description: 'Course ID associated with the watch event',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseId: ID;

  @JSONSchema({
    description: 'Version ID of the course',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsNotEmpty()
  courseVersionId: ID;

  @JSONSchema({
    description: 'Item ID that is being watched',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsNotEmpty()
  itemId: ID;

  @JSONSchema({
    description: 'Start time of the watch session',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @JSONSchema({
    description: 'End time of the watch session',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  endTime?: Date;
}

export class ResetCourseProgressParams {
  @JSONSchema({
    description: 'User ID to reset progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Course ID to reset progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to reset progress for',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export class ResetCourseProgressBody {
  @JSONSchema({
    description: 'Optional module ID to reset progress to',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  moduleId?: string | null;

  @JSONSchema({
    description: 'Optional section ID to reset progress to',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  sectionId?: string | null;

  @JSONSchema({
    description: 'Optional item ID to reset progress to',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  itemId?: string | null;

  @Expose()
  @JSONSchema({
    description: 'field to trigger validation error if moduleId is not provided',
    readOnly: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ValidateIf(
    o => o.moduleId === null && (o.sectionId !== null || o.itemId !== null),
    {message: 'moduleId is required if sectionId or itemId is provided'},
  )
  invalidFieldsCheck?: any; // dummy field to trigger validation error

  @Expose()
  @JSONSchema({
    description: 'field to trigger validation error if sectionId is not provided',
    readOnly: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ValidateIf(o => o.sectionId === null && o.itemId !== null, {
    message: 'sectionId is required if itemId is provided',
  })
  invalidFieldsCheck2?: any; // dummy field to trigger validation error
}

export class ProgressDataResponse implements IProgress {
  @JSONSchema({
    description: 'Unique identifier for this progress record.',
    example: '60d5ec49b3f1c8e4a8f8b8d1',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
    readOnly: true,
  })
  @IsString()
  @IsMongoId()
  _id?: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the user associated with this progress record.',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the course the user is progressing through.',
    example: '60d5ec49b3f1c8e4a8f8b8c2',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseId: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the specific version of the course being progressed through.',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  courseVersionId: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the current module the user is on.',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  currentModule: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the current section the user is on.',
    example: '60d5ec49b3f1c8e4a8f8b8c6',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  currentSection: ID;

  @JSONSchema({
    description: 'MongoDB ObjectId of the current item (e.g., lecture, quiz) the user is on.',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  currentItem: ID;

  @JSONSchema({
    description: 'Boolean flag indicating whether the user has completed the course.',
    example: false,
    type: 'boolean',
  })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;
}

export class CompletedProgressResponse {
  @JSONSchema({
    description: 'Indicates whether the course has been completed',
    example: true,
    type: 'boolean',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @JSONSchema({
    description: 'Percentage of course completion',
    example: 75,
    type: 'number',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsNumber()
  percentCompleted: number;

  @JSONSchema({
    description: 'Total number of items in the course',
    example: 20,
    type: 'number',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsNumber()
  totalItems: number;

  @JSONSchema({
    description: 'Total number of completed items in the course',
    example: 15,
    type: 'number',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsNumber()
  completedItems: number;
}

export class ProgressNotFoundErrorResponse {
  @JSONSchema({
    description: 'Error message indicating progress not found',
    example: 'Progress not found for the specified user and course version',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

export class WatchTimeParams {
  @JSONSchema({
    description: 'user ID to get watch time for',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string;

  @JSONSchema({
    description: 'Item ID to get watch time for',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  itemId: string;
}

export class WatchTimeBody {
  @JSONSchema({
    description: 'Course ID to get watch time for',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  courseId: string;

  @JSONSchema({
    description: 'Course version ID to get watch time for',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  versionId: string;
}

export const PROGRESS_VALIDATORS = [
  GetUserProgressParams,
  StartItemBody,
  StartItemParams,
  StartItemResponse,
  StopItemBody,
  StopItemParams,
  UpdateProgressBody,
  UpdateProgressParams,
  ResetCourseProgressBody,
  ResetCourseProgressParams,
  ProgressDataResponse,
  CompletedProgressResponse,
  ProgressNotFoundErrorResponse,
  WatchTimeParams,
  WatchTimeBody,
]