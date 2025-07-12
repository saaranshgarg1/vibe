import {
  ObjectIdToString,
  StringToObjectId,
} from '#root/shared/constants/transformerConstants.js';
import {ID, IProgress} from '#root/shared/interfaces/models.js';
import {Expose, Transform} from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import {ObjectId} from 'mongodb';

@Expose()
export class Progress implements IProgress {
  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Progress record ID',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a901',
  })
  @IsOptional()
  _id?: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'User ID associated with the progress',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a902',
  })
  @IsNotEmpty()
  userId: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Course ID to which this progress belongs',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a903',
  })
  @IsNotEmpty()
  courseId: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Course version ID tracking this progress',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a904',
  })
  @IsNotEmpty()
  courseVersionId: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Current module ID the user is engaged with',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a905',
  })
  @IsNotEmpty()
  currentModule: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Current section ID the user is progressing through',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a906',
  })
  @IsNotEmpty()
  currentSection: ID;

  @Expose()
  @Transform(ObjectIdToString.transformer, { toPlainOnly: true })
  @Transform(StringToObjectId.transformer, { toClassOnly: true })
  @JSONSchema({
    description: 'Current item ID the user is viewing or interacting with',
    type: 'string',
    example: '64b1c1f5a2c4b8d9e6f7a907',
  })
  @IsNotEmpty()
  currentItem: ID;

  @Expose()
  @ValidateNested()
  @JSONSchema({
    description: 'Indicates whether the user has completed the course',
    type: 'boolean',
    example: false,
  })
  @IsNotEmpty()
  completed: boolean;

  constructor(
    userId?: string,
    courseId?: string,
    courseVersionId?: string,
    currentModule?: string,
    currentSection?: string,
    currentItem?: string,
    completed = false,
  ) {
    if (
      userId &&
      courseId &&
      courseVersionId &&
      currentModule &&
      currentSection &&
      currentItem
    ) {
      this.userId = new ObjectId(userId);
      this.courseId = new ObjectId(courseId);
      this.courseVersionId = new ObjectId(courseVersionId);
      this.currentModule = new ObjectId(currentModule);
      this.currentSection = new ObjectId(currentSection);
      this.currentItem = new ObjectId(currentItem);
      this.completed = completed;
    }
  }
}
