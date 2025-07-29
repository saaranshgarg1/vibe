import 'reflect-metadata';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import {Type} from 'class-transformer';
import {JSONSchema} from 'class-validator-jsonschema';
import {ID} from '#root/shared/interfaces/models.js';
import {EntityType, IReport, ReportStatus} from '#root/shared/index.js';
import {
  ENTITY_TYPE_VALUES,
  EntityTypeEnum,
  REPORT_STATUS_VALUES,
  ReportStatusEnum,
} from '../../constants.js';
import {ReportStatusEntry} from '../transformers/Report.js';
import {Course} from '#root/modules/courses/classes/index.js';
import {User} from '#root/modules/auth/classes/index.js';

class ReportBody implements Partial<IReport> {
  @JSONSchema({
    title: 'Course ID',
    description: 'ID of the course associated with the report',
    example: '64bfcaf6e13e3547e90c1234',
    type: 'string',
  })
  @IsNotEmpty()
  courseId: ID;

  @JSONSchema({
    title: 'Course Version ID',
    description: 'ID of the course version associated with the report',
    example: '64bfcaf6e13e3547e90c5678',
    type: 'string',
  })
  @IsNotEmpty()
  versionId: ID;

  @JSONSchema({
    title: 'Entity ID',
    description: 'ID of the content being reported (e.g., quiz, video)',
    example: '64bfcb05e13e3547e90c8765',
    type: 'string',
  })
  @IsNotEmpty()
  entityId: ID;

  @JSONSchema({
    title: 'Entity Type',
    description: 'Type of the reported entity',
    example: 'quiz',
    type: 'string',
    enum: ENTITY_TYPE_VALUES,
  })
  @IsNotEmpty()
  @IsEnum(EntityTypeEnum)
  entityType: EntityType;

  @JSONSchema({
    title: 'Report Reason',
    description: 'Reason for submitting the report',
    example: 'Question is incorrect',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

class UpdateReportStatusBody {
  @JSONSchema({
    title: 'New Status',
    description: 'Updated status of the report',
    example: 'RESOLVED',
    type: 'string',
    enum: REPORT_STATUS_VALUES,
  })
  @IsNotEmpty()
  @IsEnum(ReportStatusEnum)
  status: ReportStatus;

  @JSONSchema({
    title: 'Status Change Comment',
    description: 'Reason/comment for changing the status',
    example: 'Report reviewed and resolved by moderator',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}

class ReportUpdateParams {
  @JSONSchema({
    description: 'Object ID of the report',
    example: '64bfcd02e13e3547e90c9876',
    type: 'string',
  })
  @IsNotEmpty()
  reportId: string;
}

// params for get all flags for instructor dashboard

export class GetReportParams {
  @JSONSchema({
    description: 'ID of the course for which reports are being queried',
    example: '64bfcaf6e13e3547e90c1234',
    type: 'string',
  })
  @IsNotEmpty()
  courseId: string;
  @JSONSchema({
    description: 'ID of the course version for which reports are being queried',
    example: '64bfcaf6e13e3547e90c1234',
    type: 'string',
  })
  @IsNotEmpty()
  versionId: string;
}
export class ReportFiltersQuery {
  @JSONSchema({
    description: 'Type of the reported entity (optional)',
    example: 'quiz',
    type: 'string',
    enum: ENTITY_TYPE_VALUES,
  })
  @IsOptional()
  @IsEnum(EntityTypeEnum)
  entityType?: EntityType;

  @JSONSchema({
    description: 'Status of the report (optional)',
    example: 'REPORTED',
    type: 'string',
    enum: REPORT_STATUS_VALUES,
  })
  @IsOptional()
  @IsEnum(ReportStatusEnum)
  status?: ReportStatus;

  @JSONSchema({
    description: 'Limit for pagination',
    example: 10,
    type: 'integer',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @JSONSchema({
    description: 'Offset for pagination',
    example: 0,
    type: 'integer',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentPage?: number = 1;
}

class ReportDataResponse {
  @JSONSchema({description: 'Report ID', type: 'string', readOnly: true})
  _id: ID;

  @ValidateNested()
  @Type(() => Course)
  @JSONSchema({$ref: '#/components/schemas/Course'})
  courseId: Course;
  // @JSONSchema({description: 'Course ID', type: 'string'})
  // @IsString()
  // courseId: ID;

  @JSONSchema({description: 'Course Version ID', type: 'string'})
  versionId: ID;

  @JSONSchema({description: 'Reported Entity ID', type: 'string'})
  entityId: ID;

  @JSONSchema({
    description: 'Entity Type',
    enum: ENTITY_TYPE_VALUES,
    type: 'string',
  })
  entityType: EntityType;

  @ValidateNested()
  @Type(() => User)
  @JSONSchema({$ref: '#/components/schemas/User'})
  reportedBy: User;
  // @JSONSchema({description: 'Reported User ID', type: 'string'})
  // @IsString()
  // reportedBy: ID;

  @JSONSchema({description: 'Reason for the report', type: 'string'})
  reason: string;

  @ValidateNested({each: true})
  @Type(() => ReportStatusEntry)
  @JSONSchema({
    title: 'Status History',
    description: 'List of status updates for the report',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: REPORT_STATUS_VALUES,
        },
        comment: {type: 'string'},
        timestamp: {type: 'string', format: 'date-time'},
      },
    },
  })
  status: ReportStatusEntry;

  @JSONSchema({
    description: 'Created timestamp',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @JSONSchema({
    description: 'Updated timestamp',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

export class ReportResponse {
  @JSONSchema({
    description: 'Total number of report documents in the response',
    example: 100,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  totalDocuments: number;

  @JSONSchema({
    description: 'Total number of pages in the response',
    example: 10,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  totalPages: number;

  @JSONSchema({
    description: 'Current page number in the response',
    example: 1,
    type: 'integer',
  })
  @IsNotEmpty()
  @IsInt()
  currentPage: number;

  @JSONSchema({
    description: 'Array of report data',
    type: 'array',
    items: {$ref: '#/components/schemas/ReportDataResponse'},
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({each: true})
  @Type(() => ReportDataResponse)
  reports: ReportDataResponse[];
}

class ReportNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message.',
    example: 'No report found with the given ID.',
    type: 'string',
  })
  @IsNotEmpty()
  message: string;
}

export {
  ReportBody,
  UpdateReportStatusBody,
  ReportUpdateParams,
  ReportDataResponse,
  ReportNotFoundErrorResponse,
};

export const REPORT_VALIDATORS = [
  ReportBody,
  UpdateReportStatusBody,
  ReportFiltersQuery,
  ReportUpdateParams,
  ReportDataResponse,
  ReportNotFoundErrorResponse,
  ReportResponse,
];
