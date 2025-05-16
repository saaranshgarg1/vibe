import {
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {IModule, ISection} from 'shared/interfaces/Models';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * Payload for creating a new module inside a course version.
 *
 * @category Courses/Validators/ModuleValidators
 */
class CreateModuleBody implements Partial<IModule> {
  /**
   * Name/title of the module.
   * Maximum 255 characters.
   */
  @JSONSchema({
    title: 'Module Name',
    description: 'Name/title of the module',
    example: 'Introduction to Data Structures',
    type: 'string',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * Detailed description of the module.
   * Maximum 1000 characters.
   */
  @JSONSchema({
    title: 'Module Description',
    description: 'Detailed description of the module content',
    example:
      'This module covers fundamental data structures including arrays, linked lists, stacks, and queues.',
    type: 'string',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;

  /**
   * Optional: Move the module after this ID.
   */
  @JSONSchema({
    title: 'After Module ID',
    description: 'Optional: Position the new module after this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterModuleId?: string;

  /**
   * Optional: Move the module before this ID.
   */
  @JSONSchema({
    title: 'Before Module ID',
    description: 'Optional: Position the new module before this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeModuleId?: string;
}

/**
 * Payload for updating an existing module.
 * Supports partial updates.
 *
 * @category Courses/Validators/ModuleValidators
 */
class UpdateModuleBody implements Partial<IModule> {
  /**
   * New name of the module (optional).
   */
  @JSONSchema({
    title: 'Module Name',
    description: 'Updated name of the module',
    example: 'Advanced Data Structures',
    type: 'string',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;

  /**
   * New description of the module (optional).
   */
  @JSONSchema({
    title: 'Module Description',
    description: 'Updated description of the module content',
    example:
      'This module covers advanced data structures including trees, graphs, and hash tables.',
    type: 'string',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;

  /**
   * At least one of `name` or `description` must be provided.
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
 * Payload for moving a module within its version.
 *
 * @category Courses/Validators/ModuleValidators
 */
class MoveModuleBody {
  /**
   * Optional: Move the module after this ID.
   */
  @JSONSchema({
    title: 'After Module ID',
    description: 'Move the module after this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterModuleId?: string;

  /**
   * Optional: Move the module before this ID.
   */
  @JSONSchema({
    title: 'Before Module ID',
    description: 'Move the module before this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeModuleId?: string;

  /**
   * Validation helper: at least one of afterModuleId or beforeModuleId is required.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Either afterModuleId or beforeModuleId must be provided.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => !o.afterModuleId && !o.beforeModuleId)
  @IsNotEmpty({
    message:
      'At least one of "afterModuleId" or "beforeModuleId" must be provided',
  })
  onlyOneAllowed: string;

  /**
   * Validation helper: both afterModuleId and beforeModuleId should not be used together.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Both afterModuleId and beforeModuleId should not be provided together.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => o.afterModuleId && o.beforeModuleId)
  @IsNotEmpty({
    message: 'Only one of "afterModuleId" or "beforeModuleId" must be provided',
  })
  bothNotAllowed: string;
}

/**
 * Route parameters for creating a module.
 *
 * @category Courses/Validators/ModuleValidators
 */
class CreateModuleParams {
  /**
   * ID of the course version to which the module will be added.
   */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version to which the module will be added',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;
}

/**
 * Route parameters for updating a module.
 *
 * @category Courses/Validators/ModuleValidators
 */
class UpdateModuleParams {
  /**
   * ID of the course version.
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
  versionId: string;

  /**
   * ID of the module to be updated.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module to be updated',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;
}

/**
 * Route parameters for moving a module.
 *
 * @category Courses/Validators/ModuleValidators
 */
class MoveModuleParams {
  /**
   * ID of the course version.
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
  versionId: string;

  /**
   * ID of the module to move.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module to move',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;
}

/**
 * Route parameters for deleting a module from a course version.
 *
 * @category Courses/Validators/CourseVersionValidators
 */
class DeleteModuleParams {
  /**
   * ID of the course version.
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
  versionId: string;

  /**
   * ID of the module to delete.
   */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module to delete',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;
}

/**
 * Response for Module operations
 *
 * @category Courses/Validators/ModuleValidators
 */
class ModuleVersionResponse {
  @JSONSchema({
    description: 'The updated course version data containing modules',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  version: Record<string, any>;
}

/**
 * Response for Module Not Found error
 *
 * @category Courses/Validators/ModuleValidators
 */
class ModuleNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message',
    example:
      'No module found with the specified ID. Please verify the ID and try again.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

/**
 * Response for Module deletion
 *
 * @category Courses/Validators/ModuleValidators
 */
class ModuleDeletedResponse {
  @JSONSchema({
    description: 'Deletion confirmation message',
    example:
      'Module with the ID 60d5ec49b3f1c8e4a8f8b8e6 in Version 60d5ec49b3f1c8e4a8f8b8d5 has been deleted successfully.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

export {
  CreateModuleBody,
  UpdateModuleBody,
  CreateModuleParams,
  UpdateModuleParams,
  MoveModuleParams,
  MoveModuleBody,
  DeleteModuleParams,
  ModuleVersionResponse,
  ModuleNotFoundErrorResponse,
  ModuleDeletedResponse,
};
