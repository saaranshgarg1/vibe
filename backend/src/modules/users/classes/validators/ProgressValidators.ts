import {ID, IProgress} from '#root/shared/interfaces/models.js';
import {Expose} from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';

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
  courseVersionId: string;
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
  courseVersionId: string;
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
  courseVersionId: string;
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
  courseVersionId: string;
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
  courseVersionId: string;
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
  ProgressNotFoundErrorResponse
]