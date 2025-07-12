import {IModule, ICourseVersion} from '#root/shared/interfaces/models.js';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsMongoId,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {OnlyOneId} from './customValidators.js';
import { CourseVersion } from '../transformers/CourseVersion.js';
import { Type } from 'class-transformer';

class CreateModuleBody implements Partial<IModule> {
  @JSONSchema({
    description: 'Name/title of the module',
    example: 'Introduction to Data Structures',
    type: 'string',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @JSONSchema({
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

  @JSONSchema({
    description: 'Position the new module after this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  @OnlyOneId({
    afterIdPropertyName: 'afterModuleId',
    beforeIdPropertyName: 'beforeModuleId',
  })
  afterModuleId?: string;

  @JSONSchema({
    description: 'Position the new module before this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeModuleId?: string;
}

class UpdateModuleBody implements Partial<IModule> {
  @JSONSchema({
    description: 'Updated name of the module',
    example: 'Advanced Data Structures',
    type: 'string',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @JSONSchema({
    description: 'Updated description of the module content',
    example:
      'This module covers advanced data structures including trees, graphs, and hash tables.',
    type: 'string',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  description: string;
}

class MoveModuleBody {
  @JSONSchema({
    description: 'Move the module after this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  @OnlyOneId({
    afterIdPropertyName: 'afterModuleId',
    beforeIdPropertyName: 'beforeModuleId',
  })
  afterModuleId?: string;

  @JSONSchema({
    description: 'Move the module before this module ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeModuleId?: string;
}

class CreateModuleParams {
  @JSONSchema({
    description: 'ID of the course version to which the module will be added',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  versionId: string;
}

class VersionModuleParams {
  @JSONSchema({
    description: 'ID of the course version containing the module',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  @JSONSchema({
    description: 'ID of the module to be updated',
    type: 'string',
    pattern: '^[a-fA-F0-9]{24}$',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;
}

class ModuleDataResponse {
  @JSONSchema({
    description: 'The updated course version data containing modules',
    type: 'object',
    readOnly: true,
  })
  @Type(() => CourseVersion)
  @ValidateNested()
  @IsNotEmpty()
  version: CourseVersion;
}

class ModuleNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

class ModuleDeletedResponse {
  @JSONSchema({
    description: 'Deletion confirmation message',
    type: 'string',
    readOnly: true,
  })
  @ValidateNested()
  @Type(() => String)
  @IsNotEmpty()
  message: string;
}

export {
  CreateModuleBody,
  UpdateModuleBody,
  CreateModuleParams,
  VersionModuleParams,
  MoveModuleBody,
  ModuleDataResponse,
  ModuleNotFoundErrorResponse,
  ModuleDeletedResponse,
};

export const MODULE_VALIDATORS = [
  CreateModuleBody,
  UpdateModuleBody,
  CreateModuleParams,
  VersionModuleParams,
  MoveModuleBody,
  ModuleDataResponse,
  ModuleNotFoundErrorResponse,
  ModuleDeletedResponse,
]