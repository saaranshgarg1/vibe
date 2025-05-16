import {Type} from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsEmpty,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import {
  IBaseItem,
  IBlogDetails,
  IQuizDetails,
  ItemType,
  IVideoDetails,
} from 'shared/interfaces/Models';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * Video item details for embedded video learning content.
 *
 * @category Courses/Validators/ItemValidators
 */
class VideoDetailsPayloadValidator implements IVideoDetails {
  /**
   * Public video URL (e.g., YouTube or Vimeo link).
   */
  @JSONSchema({
    title: 'Video URL',
    description: 'Public video URL (e.g., YouTube or Vimeo link)',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'string',
    format: 'uri',
  })
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  URL: string;

  /**
   * Start time of the clip in HH:MM:SS format.
   */
  @JSONSchema({
    title: 'Start Time',
    description: 'Start time of the video clip in HH:MM:SS format',
    example: '00:01:30',
    type: 'string',
    pattern: '^(\\d{1,2}:)?\\d{1,2}:\\d{2}$',
  })
  @IsNotEmpty()
  @Matches(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, {
    message: 'Invalid time format, it should be HH:MM:SS',
  })
  startTime: string;

  /**
   * End time of the clip in HH:MM:SS format.
   */
  @JSONSchema({
    title: 'End Time',
    description: 'End time of the video clip in HH:MM:SS format',
    example: '00:10:15',
    type: 'string',
    pattern: '^(\\d{1,2}:)?d{1,2}:d{2}$',
  })
  @IsNotEmpty()
  @Matches(/^(\d{1,2}:)?\d{1,2}:\d{2}$/, {
    message: 'Invalid time format, it should be HH:MM:SS',
  })
  endTime: string;

  /**
   * Points assigned to the video interaction.
   */
  @JSONSchema({
    title: 'Video Points',
    description: 'Points assigned to the video interaction',
    example: 10,
    type: 'number',
  })
  @IsNotEmpty()
  @IsDecimal()
  points: number;
}

/**
 * Quiz item details for scheduled quiz-based evaluation.
 *
 * @category Courses/Validators/ItemValidators
 */
class QuizDetailsPayloadValidator implements IQuizDetails {
  /**
   * Number of quiz questions visible to students.
   */
  @JSONSchema({
    title: 'Question Visibility',
    description: 'Number of quiz questions visible to students at once',
    example: 5,
    type: 'integer',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  questionVisibility: number;

  /**
   * ISO date string representing quiz release time.
   */
  @JSONSchema({
    title: 'Quiz Release Time',
    description: 'ISO date string representing quiz release time',
    example: '2023-10-15T14:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  releaseTime: Date;

  /**
   * List of quiz question IDs (auto-managed).
   */
  @JSONSchema({
    title: 'Quiz Questions',
    description: 'List of quiz question IDs (auto-managed)',
    example: ['60d5ec49b3f1c8e4a8f8b8c1', '60d5ec49b3f1c8e4a8f8b8c2'],
    type: 'array',
    items: {
      type: 'string',
      format: 'Mongo Object ID',
    },
    readOnly: true,
  })
  @IsEmpty()
  questions: string[];

  /**
   * ISO date string for quiz deadline.
   */
  @JSONSchema({
    title: 'Quiz Deadline',
    description: 'ISO date string for quiz deadline',
    example: '2023-10-22T23:59:59Z',
    type: 'string',
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  deadline: Date;
}

/**
 * Blog item details for content-based reading or writing activities.
 *
 * @category Courses/Validators/ItemValidators
 */
class BlogDetailsPayloadValidator implements IBlogDetails {
  /**
   * Tags for categorizing the blog (auto-managed).
   */
  @JSONSchema({
    title: 'Blog Tags',
    description: 'Tags for categorizing the blog (auto-managed)',
    example: ['programming', 'algorithms'],
    type: 'array',
    items: {
      type: 'string',
    },
    readOnly: true,
  })
  @IsEmpty()
  tags: string[];

  /**
   * Full blog content in markdown or plain text.
   */
  @JSONSchema({
    title: 'Blog Content',
    description: 'Full blog content in markdown or plain text',
    example:
      '# Introduction\n\nThis is a sample blog post about programming...',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  /**
   * Points assigned to the blog submission.
   */
  @JSONSchema({
    title: 'Blog Points',
    description: 'Points assigned to the blog submission',
    example: 20,
    type: 'number',
  })
  @IsNotEmpty()
  @IsDecimal()
  points: number;

  /**
   * Estimated time to complete the blog in minutes.
   */
  @JSONSchema({
    title: 'Estimated Read Time',
    description: 'Estimated time to complete reading the blog in minutes',
    example: 15,
    type: 'integer',
    minimum: 1,
  })
  @IsNotEmpty()
  @IsPositive()
  estimatedReadTimeInMinutes: number;
}

/**
 * Body for creating an item inside a section.
 *
 * @category Courses/Validators/ItemValidators
 */
class CreateItemBody implements IBaseItem {
  /**
   * MongoDB ID (auto-assigned).
   */
  @JSONSchema({
    title: 'Item ID',
    description: 'MongoDB ID (auto-assigned)',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsEmpty()
  _id?: string;

  /**
   * Title of the item (required).
   */
  @JSONSchema({
    title: 'Item Name',
    description: 'Title of the item',
    example: 'Introduction to Data Structures',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Description of the item (required).
   */
  @JSONSchema({
    title: 'Item Description',
    description: 'Description of the item',
    example:
      'Learn about basic data structures like arrays, linked lists, and stacks.',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * Section ID to which the item belongs (auto-managed).
   */
  @JSONSchema({
    title: 'Section ID',
    description: 'Section ID to which the item belongs (auto-managed)',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsEmpty()
  sectionId: string;

  /**
   * Order key for item placement (auto-managed).
   */
  @JSONSchema({
    title: 'Item Order',
    description: 'Order key for item placement (auto-managed)',
    example: 'a1b2c3',
    type: 'string',
    readOnly: true,
  })
  @IsEmpty()
  order: string;

  /**
   * Item details (depends on type) – video, blog, or quiz.
   */
  @JSONSchema({
    title: 'Item Details',
    description: 'Item details (depends on type) – video, blog, or quiz',
    type: 'object',
    readOnly: true,
  })
  @IsEmpty()
  itemDetails: IVideoDetails | IQuizDetails | IBlogDetails;

  /**
   * Place item after this item ID (optional).
   */
  @JSONSchema({
    title: 'After Item ID',
    description: 'Place item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterItemId?: string;

  /**
   * Place item before this item ID (optional).
   */
  @JSONSchema({
    title: 'Before Item ID',
    description: 'Place item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;

  /**
   * Item creation timestamp (auto-managed).
   */
  @JSONSchema({
    title: 'Created At',
    description: 'Item creation timestamp (auto-managed)',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsEmpty()
  createdAt: Date;

  /**
   * Item update timestamp (auto-managed).
   */
  @JSONSchema({
    title: 'Updated At',
    description: 'Item update timestamp (auto-managed)',
    example: '2023-10-05T15:30:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsEmpty()
  updatedAt: Date;

  /**
   * Type of the item: VIDEO, BLOG, or QUIZ.
   */
  @JSONSchema({
    title: 'Item Type',
    description: 'Type of the item: VIDEO, BLOG, or QUIZ',
    example: 'VIDEO',
    type: 'string',
    enum: Object.values(ItemType),
  })
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;

  /**
   * Nested video details (required if type is VIDEO).
   */
  @JSONSchema({
    title: 'Video Details',
    description: 'Details specific to video items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.VIDEO)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VideoDetailsPayloadValidator)
  videoDetails?: VideoDetailsPayloadValidator;

  /**
   * Nested blog details (required if type is BLOG).
   */
  @JSONSchema({
    title: 'Blog Details',
    description: 'Details specific to blog items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.BLOG)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BlogDetailsPayloadValidator)
  blogDetails?: BlogDetailsPayloadValidator;

  /**
   * Nested quiz details (required if type is QUIZ).
   */
  @JSONSchema({
    title: 'Quiz Details',
    description: 'Details specific to quiz items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.QUIZ)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QuizDetailsPayloadValidator)
  quizDetails?: QuizDetailsPayloadValidator;
}

/**
 * Body for updating an item.
 * Allows partial updates to name, description, and details.
 *
 * @category Courses/Validators/ItemValidators
 */
class UpdateItemBody implements IBaseItem {
  /**
   * MongoDB ID of the item (auto-managed).
   */
  @JSONSchema({
    title: 'Item ID',
    description: 'MongoDB ID (auto-assigned)',
    example: '60d5ec49b3f1c8e4a8f8b8c1',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsEmpty()
  _id?: string;

  /**
   * Updated name (optional).
   */
  @JSONSchema({
    title: 'Item Name',
    description: 'Updated title of the item',
    example: 'Advanced Data Structures',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  name: string;

  /**
   * Updated description (optional).
   */
  @JSONSchema({
    title: 'Item Description',
    description: 'Updated description of the item',
    example:
      'Learn about advanced data structures like trees, graphs, and hash tables.',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description: string;

  /**
   * Section ID (auto-managed).
   */
  @JSONSchema({
    title: 'Section ID',
    description: 'Section ID to which the item belongs (auto-managed)',
    example: '60d5ec49b3f1c8e4a8f8b8d2',
    type: 'string',
    format: 'Mongo Object ID',
    readOnly: true,
  })
  @IsEmpty()
  sectionId: string;

  /**
   * Order (auto-managed).
   */
  @JSONSchema({
    title: 'Item Order',
    description: 'Order key for item placement (auto-managed)',
    example: 'a1b2c3',
    type: 'string',
    readOnly: true,
  })
  @IsEmpty()
  order: string;

  /**
   * Item details (auto-managed).
   */
  @JSONSchema({
    title: 'Item Details',
    description: 'Item details (depends on type) – video, blog, or quiz',
    type: 'object',
    readOnly: true,
  })
  @IsEmpty()
  itemDetails: IVideoDetails | IQuizDetails | IBlogDetails;

  /**
   * Created at timestamp (auto-managed).
   */
  @JSONSchema({
    title: 'Created At',
    description: 'Item creation timestamp (auto-managed)',
    example: '2023-10-01T12:00:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsEmpty()
  createdAt: Date;

  /**
   * Updated at timestamp (auto-managed).
   */
  @JSONSchema({
    title: 'Updated At',
    description: 'Item update timestamp (auto-managed)',
    example: '2023-10-05T15:30:00Z',
    type: 'string',
    format: 'date-time',
    readOnly: true,
  })
  @IsEmpty()
  updatedAt: Date;

  /**
   * Updated type, if changing item category.
   */
  @JSONSchema({
    title: 'Item Type',
    description: 'Updated type of the item: VIDEO, BLOG, or QUIZ',
    example: 'BLOG',
    type: 'string',
    enum: Object.values(ItemType),
  })
  @IsOptional()
  @IsEnum(ItemType)
  type: ItemType;

  /**
   * Optional: reorder after this item.
   */
  @JSONSchema({
    title: 'After Item ID',
    description: 'Place item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterItemId?: string;

  /**
   * Optional: reorder before this item.
   */
  @JSONSchema({
    title: 'Before Item ID',
    description: 'Place item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;

  /**
   * Updated video details (if type is VIDEO).
   */
  @JSONSchema({
    title: 'Video Details',
    description: 'Updated details specific to video items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.VIDEO)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => VideoDetailsPayloadValidator)
  videoDetails?: VideoDetailsPayloadValidator;

  /**
   * Updated blog details (if type is BLOG).
   */
  @JSONSchema({
    title: 'Blog Details',
    description: 'Updated details specific to blog items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.BLOG)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BlogDetailsPayloadValidator)
  blogDetails?: BlogDetailsPayloadValidator;

  /**
   * Updated quiz details (if type is QUIZ).
   */
  @JSONSchema({
    title: 'Quiz Details',
    description: 'Updated details specific to quiz items',
    type: 'object',
  })
  @ValidateIf(o => o.type === ItemType.QUIZ)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QuizDetailsPayloadValidator)
  quizDetails?: QuizDetailsPayloadValidator;
}

/**
 * Body to move an item within its section.
 *
 * @category Courses/Validators/ItemValidators
 */
class MoveItemBody {
  /**
   * Move after this item (optional).
   */
  @JSONSchema({
    title: 'After Item ID',
    description: 'Move the item after this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c3',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  afterItemId?: string;

  /**
   * Move before this item (optional).
   */
  @JSONSchema({
    title: 'Before Item ID',
    description: 'Move the item before this item ID',
    example: '60d5ec49b3f1c8e4a8f8b8c4',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsOptional()
  @IsMongoId()
  @IsString()
  beforeItemId?: string;

  /**
   * Validation helper – at least one of afterItemId or beforeItemId must be present.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Either afterItemId or beforeItemId must be provided.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => !o.afterItemId && !o.beforeItemId)
  @IsNotEmpty({
    message: 'At least one of "afterItemId" or "beforeItemId" must be provided',
  })
  onlyOneAllowed: string;

  /**
   * Validation helper – both afterItemId and beforeItemId cannot be present at the same time.
   */
  @JSONSchema({
    deprecated: true,
    description:
      '[READONLY] Validation helper. Both afterItemId and beforeItemId should not be provided together.',
    readOnly: true,
    type: 'string',
  })
  @ValidateIf(o => o.afterItemId && o.beforeItemId)
  @IsNotEmpty({
    message: 'Only one of "afterItemId" or "beforeItemId" must be provided',
  })
  bothNotAllowed: string;
}

/**
 * Route parameters for creating a new item.
 *
 * @category Courses/Validators/ItemValidators
 *
 */
class CreateItemParams {
  /** Version ID of the course */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  /** Module ID inside the version */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module inside the version',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;

  /** Section ID inside the module */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section inside the module',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  sectionId: string;
}

/**
 * Route parameters for retrieving all items in a section.
 *
 * @category Courses/Validators/ItemValidators
 *
 */
class ReadAllItemsParams {
  /** Version ID of the course */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version containing the items',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  /** Module ID inside the version */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module containing the section',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;

  /** Section ID inside the module */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section containing the items',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  sectionId: string;
}

/**
 * Route parameters for updating a specific item.
 *
 * @category Courses/Validators/ItemValidators
 */
class UpdateItemParams {
  /** Version ID of the course */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  /** Module ID inside the version */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module containing the section',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;

  /** Section ID inside the module */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  sectionId: string;

  /** Target item ID to update */
  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item to be updated',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

/**
 * Route parameters for moving an item.
 *
 * @category Courses/Validators/ItemValidators
 */
class MoveItemParams {
  /** Version ID of the course */
  @JSONSchema({
    title: 'Version ID',
    description: 'ID of the course version containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8d5',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  versionId: string;

  /** Module ID inside the version */
  @JSONSchema({
    title: 'Module ID',
    description: 'ID of the module containing the section',
    example: '60d5ec49b3f1c8e4a8f8b8e6',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  moduleId: string;

  /** Section ID inside the module */
  @JSONSchema({
    title: 'Section ID',
    description: 'ID of the section containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8f7',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  sectionId: string;

  /** Item ID to move */
  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item to be moved',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

/**
 * Route parameters for deleting an item.
 *
 * @category Courses/Validators/ItemValidators
 */
class DeleteItemParams {
  /** ItemsGroupId */
  @JSONSchema({
    title: 'Items Group ID',
    description: 'ID of the items group containing the item',
    example: '60d5ec49b3f1c8e4a8f8b8g9',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemsGroupId: string;

  /** ItemId */
  @JSONSchema({
    title: 'Item ID',
    description: 'ID of the item to delete',
    example: '60d5ec49b3f1c8e4a8f8b8f8',
    type: 'string',
    format: 'Mongo Object ID',
  })
  @IsMongoId()
  @IsString()
  itemId: string;
}

/**
 * Response for Item Not Found error.
 *
 * @category Courses/Validators/ItemValidators
 *
 */
class ItemNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message',
    example:
      'No item found with the specified ID. Please verify the ID and try again.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  message: string;
}

/**
 * Response for Item Data
 *
 * @category Courses/Validators/ItemValidators
 *
 */
class ItemDataResponse {
  @JSONSchema({
    description: 'The item data',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  itemsGroup: Record<string, any>;

  @JSONSchema({
    description: 'The updated version data (when applicable)',
    type: 'object',
    readOnly: true,
  })
  @IsOptional()
  version?: Record<string, any>;
}

/**
 * Response for Deleted Item
 *
 * @category Courses/Validators/ItemValidators
 *
 */
class DeletedItemResponse {
  @JSONSchema({
    description: 'The deleted item data',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  deletedItem: Record<string, any>;

  @JSONSchema({
    description: 'The updated items group after deletion',
    type: 'object',
    readOnly: true,
  })
  @IsNotEmpty()
  updatedItemsGroup: Record<string, any>;
}

export {
  CreateItemBody,
  UpdateItemBody,
  MoveItemBody,
  VideoDetailsPayloadValidator,
  QuizDetailsPayloadValidator,
  BlogDetailsPayloadValidator,
  CreateItemParams,
  ReadAllItemsParams,
  UpdateItemParams,
  MoveItemParams,
  DeleteItemParams,
  ItemNotFoundErrorResponse,
  ItemDataResponse,
  DeletedItemResponse,
};
