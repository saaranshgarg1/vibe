import 'reflect-metadata';
import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  ValidateNested,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ICourseSettings,
  IDetectorOptions,
  IDetectorSettings,
  ISettings,
  IUserSettings,
} from '#shared/interfaces/models.js';
import { JSONSchema } from 'class-validator-jsonschema';
import { ProctoringComponent } from '#shared/database/interfaces/ISettingsRepository.js';

/**
 * This file contains classes and DTOs for validating course and user settings related to proctoring.
 *
 */

export class DetectorOptionsDto implements IDetectorOptions {
  @IsBoolean()
  @JSONSchema({
    description: 'Whether the detector is enabled',
    example: true,
  })
  enabled: boolean;
}

export class DetectorSettingsDto implements IDetectorSettings {
  @JSONSchema({
    description: 'The detector type',
    example: ProctoringComponent.CAMERAMICRO,
  })
  @IsNotEmpty()
  @IsEnum(ProctoringComponent)
  detectorName: ProctoringComponent;

  @JSONSchema({
    description: 'Configuration options for the detector',
    example: { enabled: true },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DetectorOptionsDto)
  settings: DetectorOptionsDto;
}

export class ProctoringSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetectorSettingsDto)
  detectors: DetectorSettingsDto[];
}

export class SettingsDto {
  @ValidateNested()
  @Type(() => ProctoringSettingsDto)
  proctors: ProctoringSettingsDto;
}

@ValidatorConstraint({ async: false })
export class containsAllDetectorsConstraint
  implements ValidatorConstraintInterface {
  validate(value: Array<any>, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }

    const requiredDetectors = Object.values(ProctoringComponent);
    const detectorNames = value.map(detector => detector.detectorName);
    return requiredDetectors.every(detectorName =>
      detectorNames.includes(detectorName),
    );
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Array must contain all Proctoring Components. Available components: ${Object.values(
      ProctoringComponent,
    ).join(', ')}`;
  }
}

export function containsAllDetectors(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: containsAllDetectorsConstraint,
    });
  };
}

// This class represents the validation schema for creating course settings.
export class CreateCourseSettingsBody implements Partial<ICourseSettings> {
  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseVersionId: string;

  @JSONSchema({
    description: 'Id of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
}

// This class represents the validation schema for reading course settings.
export class ReadCourseSettingsParams {
  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  versionId: string;
}

// This class represents the validation schema of Prameters for adding proctoring to a course.
export class AddCourseProctoringParams {
  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  versionId: string;
}

// This class represents the validation schema of body for adding proctoring to a course.
export class AddCourseProctoringBody {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetectorSettingsDto)
  detectors: DetectorSettingsDto[];
}

// This class represents the validation schema of Parameters for removing proctoring from a course.
export class RemoveCourseProctoringParams {
  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseVersionId: string;
}

// This class represents the validation schema of body for removing proctoring from a course.
export class RemoveCourseProctoringBody {
  @JSONSchema({
    description: 'Component to remove from course proctoring',
    enum: Object.values(ProctoringComponent),
    example: ProctoringComponent.CAMERAMICRO,
  })
  @IsNotEmpty()
  @IsEnum(ProctoringComponent)
  detectorName: ProctoringComponent;
}

// This class represents the validation schema for creating user settings.
export class CreateUserSettingsBody implements Partial<IUserSettings> {
  @JSONSchema({
    description: 'ID of the student',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  studentId: string;

  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseVersionId: string;

  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
}

export class ReadUserSettingsParams {
  @JSONSchema({
    description: 'ID of the student',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  studentId: string;

  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  versionId: string;
}

// This class represents the validation schema of Parameters for adding proctoring to a user Setting.
export class AddUserProctoringParams {
  @JSONSchema({
    description: 'ID of the student',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  studentId: string;

  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  versionId: string;
}

// This class represents the validation schema of body for adding proctoring to a user Setting.
export class AddUserProctoringBody {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetectorSettingsDto)
  detectors: DetectorSettingsDto[];
}

// This class represents the validation schema of Parameters for removing proctoring from a user Setting.
export class RemoveUserProctoringParams {
  @JSONSchema({
    description: 'ID of the student',
    example: '60d5ec49b3f1c8e4a8f8b8c5',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  studentId: string;

  @JSONSchema({
    description: 'ID of the course',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseId: string;

  @JSONSchema({
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  courseVersionId: string;
}

export class RemoveUserProctoringBody {
  @JSONSchema({
    description: 'Component to remove from user proctoring',
    enum: Object.values(ProctoringComponent),
    example: ProctoringComponent.CAMERAMICRO,
  })
  @IsNotEmpty()
  @IsEnum(ProctoringComponent)
  detectorName: ProctoringComponent;
}
