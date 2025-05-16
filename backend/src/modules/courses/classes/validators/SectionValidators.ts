import {
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {ISection} from 'shared/interfaces/Models';
import {ID} from 'shared/types';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * Payload for creating a section inside a module.
 *
 * @category Courses/Validators/SectionValidators
 */
class CreateSectionBody implements Partial<ISection> {
  /**
   * Name/title of the section.
   * Maximum 255 characters.
   */
  @JSONSchema({
    title: 'Section Name',
    description: 'Name/title of the section',
    example: 'Introduction to Algorithms',
    type: 'string',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Description or purpose of the section.
   * Maximum 1000 characters.
   */
  @JSONSchema({
    title: 'Section Description',
    description: 'Description or purpose of the section',
    example:
      'This section covers fundamental algorithmic concepts including time complexity and space complexity.',
    type: 'string',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  /**
   * Optional: place the section after this section ID.
   */
  @JSONSchema({
    title: 'After Section ID',
    description: 'Optional: Place the new section after this section ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterSectionId?: string;

  /**
   * Optional: place the section before this section ID.
   */
  @JSONSchema({
    title: 'Before Section ID',
    description: 'Optional: Place the new section before this section ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeSectionId?: string;
}

/**
 * Payload for updating a section.
 * Allows partial updates to name or description.
 *
 * @category Courses/Validators/SectionValidators
 */
class UpdateSectionBody implements Partial<ISection> {
  /**
   * New name of the section (optional).
   */
  @JSONSchema({
    title: 'Section Name',
    description: 'Updated name of the section',
    example: 'Advanced Algorithms',
    type: 'string',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * New description of the section (optional).
   */
  @JSONSchema({
    title: 'Section Description',
    description: 'Updated description of the section',
    example:
      'This section covers advanced algorithmic concepts including dynamic programming and greedy algorithms.',
    type: 'string',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;

  /**
   * At least one of name or description must be provided.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] This is a virtual field used only for validation. Do not include this field in requests.\nEither "name" or "description" must be provided.',
    readOnly: true,
    writeOnly: false,
    type: 'string',
  })
  @ValidateIf(o => !o.name && !o.description)
  @IsNotEmpty({
    message: 'At least one of "name" or "description" must be provided',
  })
  nameOrDescription: string;
}

/**
 * Payload for reordering a section within a module.
 *
 * @category Courses/Validators/SectionValidators
 */
class MoveSectionBody {
  /**
   * Optional: move after this section ID.
   */
  @JSONSchema({
    title: 'After Section ID',
    description: 'Move the section after this section ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterSectionId?: string;

  /**
   * Optional: move before this section ID.
   */
  @JSONSchema({
    title: 'Before Section ID',
    description: 'Move the section before this section ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeSectionId?: string;

  /**
   * Validation helper — at least one position ID must be provided.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Either afterSectionId or beforeSectionId must be provided.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => !o.afterSectionId && !o.beforeSectionId)
  @IsNotEmpty({
    message:
      'At least one of "afterSectionId" or "beforeSectionId" must be provided',
  })
  onlyOneAllowed: string;

  /**
   * Validation helper — only one of before/after should be used.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Both afterSectionId and beforeSectionId should not be provided together.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => o.afterSectionId && o.beforeSectionId)
  @IsNotEmpty({
    message:
      'Only one of "afterSectionId" or "beforeSectionId" must be provided',
  })
  bothNotAllowed: string;
}

/**
 * Route parameters for creating a section in a module.
 *
 * @category Courses/Validators/SectionValidators
 */
class CreateSectionParams {
  /**
   * Version ID of the course the module belongs to.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version to which the module belongs',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  versionId: string;

  /**
   * Module ID where the new section will be added.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module where the new section will be added',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  moduleId: string;
}

/**
 * Route parameters for moving a section within a module.
 *
 * @category Courses/Validators/SectionValidators
 */
class MoveSectionParams {
  /**
   * Version ID of the course.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version containing the module',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  versionId: string;

  /**
   * Module ID within the version.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module containing the section',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  /**
   * Section ID that needs to be moved.
   */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section to be moved',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  sectionId: string;
}

/**
 * Route parameters for updating a section.
 *
 * @category Courses/Validators/SectionValidators
 */
class UpdateSectionParams {
  /**
   * Version ID of the course.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version containing the module',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  versionId: string;

  /**
   * Module ID where the section exists.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module containing the section',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  /**
   * Section ID to be updated.
   */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section to be updated',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  sectionId: string;
}

/**
 * Response for Section operations
 *
 * @category Courses/Validators/SectionValidators
 */
class SectionVersionResponse {
  @JSONSchema({
    description: 'The updated course version data containing the section',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  version: Record<string, any>;
}

/**
 * Response for Section Not Found error
 *
 * @category Courses/Validators/SectionValidators
 */
class SectionNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message',
    example:
      'No section found with the specified ID. Please verify the ID and try again.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

export {
  CreateSectionBody,
  UpdateSectionBody,
  MoveSectionBody,
  CreateSectionParams,
  MoveSectionParams,
  UpdateSectionParams,
  SectionVersionResponse,
  SectionNotFoundErrorResponse,
};
