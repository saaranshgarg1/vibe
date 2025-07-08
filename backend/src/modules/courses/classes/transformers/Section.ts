import {calculateNewOrder} from '#courses/utils/calculateNewOrder.js';

import {Expose, Transform, Type} from 'class-transformer';
import {ObjectId} from 'mongodb';
import {CreateSectionBody} from '../validators/SectionValidators.js';
import {
  ObjectIdToString,
  StringToObjectId,
} from '#root/shared/constants/transformerConstants.js';
import {ISection, ID} from '#root/shared/interfaces/models.js';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Section data transformation.
 *
 * @category Courses/Transformers
 */
class Section implements ISection {
  @Expose()
  @Transform(ObjectIdToString.transformer, {toPlainOnly: true})
  @Transform(StringToObjectId.transformer, {toClassOnly: true})
  @JSONSchema({
    description: 'Unique identifier for the section',
    example: '60f6bc47c8b7d9e5f1a2a3b4',
    type: 'string',
  })
  @IsOptional()
  sectionId?: ID;

  @Expose()
  @JSONSchema({
    description: 'Name of the section',
    example: 'Variables and Data Types',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @JSONSchema({
    description: 'Brief description of what this section covers',
    example: 'This section explains variables, constants, and data types in JavaScript.',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Expose()
  @JSONSchema({
    description: 'String that defines the section order in the module',
    example: '001-001',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  order: string;

  @Expose()
  @JSONSchema({
    description: 'ID of the items group associated with this section',
    example: '60f6bc47c8b7d9e5f1a2a3b5',
    type: 'string',
  })
  @IsNotEmpty()
  itemsGroupId: ID;

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Timestamp when the section was created',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T09:30:00.000Z',
  })
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @IsDateString()
  @JSONSchema({
    description: 'Timestamp when the section was last updated',
    type: 'string',
    format: 'date-time',
    example: '2024-07-01T11:00:00.000Z',
  })
  @IsNotEmpty()
  updatedAt: Date;

  constructor(sectionBody: CreateSectionBody, existingSections: ISection[]) {
    if (sectionBody) {
      this.name = sectionBody.name;
      this.description = sectionBody.description;
    }
    const sortedSections = existingSections.sort((a, b) =>
      a.order.localeCompare(b.order),
    );
    this.sectionId = new ObjectId();
    this.order = calculateNewOrder(
      sortedSections,
      'sectionId',
      sectionBody.afterSectionId,
      sectionBody.beforeSectionId,
    );
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export {Section};
