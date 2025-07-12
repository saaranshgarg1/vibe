import {
  IQuestionAnswer,
  Answer,
  IGradingResult,
  IQuestionAnswerFeedback,
  IAttemptDetails,
  IQuestionDetails,
  IAttempt,
  ISubmission,
  IUserQuizMetrics,
} from '#quizzes/interfaces/grading.js';
import { ILotItemRenderView, IQuestionRenderView, ParameterMap } from '#quizzes/question-processing/index.js';
import { ItemType, IQuizDetails, IQuestionBankRef } from '#shared/interfaces/models.js';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsDate,
  IsBoolean,
  ArrayNotEmpty,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { ObjectId } from 'mongodb';
import { QuestionBankRef } from '../transformers/QuestionBank.js';
import { QuestionType } from '#root/shared/interfaces/quiz.js';
import { Question } from './QuestionValidator.js';

class QuestionAnswerFeedback implements IQuestionAnswerFeedback {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Question ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c02',
  })
  questionId: string | ObjectId;

  @IsEnum(['CORRECT', 'INCORRECT', 'PARTIAL'])
  @IsNotEmpty()
  @JSONSchema({
    description: 'Answer status',
    type: 'string',
    enum: ['CORRECT', 'INCORRECT', 'PARTIAL'],
    example: 'CORRECT',
  })
  status: 'CORRECT' | 'INCORRECT' | 'PARTIAL';

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Score awarded',
    type: 'number',
    example: 5,
  })
  score: number;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Answer feedback',
    type: 'string',
    example: 'Good job! You answered correctly.',
  })
  answerFeedback?: string;
}

// Request Schemas
class CreateAttemptParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;
}

class SaveAttemptParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the attempt',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string;
}

class SubmitAttemptParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the attempt',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string;
}

class GetAttemptResponse implements IAttempt {
  @IsMongoId()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  _id?: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Quiz ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string | ObjectId;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionDetails)
  @JSONSchema({
    description: 'Details of questions in the attempt',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionDetails' },
    example: [{ questionId: '60d21b4667d0d8992e610c02' }],
  })
  questionDetails: QuestionDetails[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswer)
  @JSONSchema({
    description: 'Submitted answers',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionAnswer' },
  })
  answers?: QuestionAnswer[];

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt creation time',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:00:00.000Z',
  })
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Last update time',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:30:00.000Z',
  })
  updatedAt: Date;
}

class SOLAnswer {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the selected lot item',
    type: 'string',
    example: '60d21b4667d0d8992e610c10',
  })
  lotItemId: string;
}

class SMLAnswer {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  @JSONSchema({
    description: 'IDs of the selected lot items',
    type: 'array',
    items: { type: 'string', example: '60d21b4667d0d8992e610c10' },
    example: ['60d21b4667d0d8992e610c10', '60d21b4667d0d8992e610c11'],
  })
  lotItemIds: string[];
}

class Order {
  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Order of the lot item',
    type: 'number',
    example: 1,
  })
  order: number;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the lot item',
    type: 'string',
    example: '60d21b4667d0d8992e610c10',
  })
  lotItemId: string;
}

class OTLAnswer {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Order)
  @IsNotEmpty()
  @JSONSchema({
    description: 'Orderings of lot items',
    type: 'array',
    items: { $ref: '#/components/schemas/Order' },
    example: [{ order: 1, lotItemId: '60d21b4667d0d8992e610c10' }],
  })
  orders: Order[];
}

class NATAnswer {
  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Numeric answer value',
    type: 'number',
    example: 42,
  })
  value: number;
}

class DESAnswer {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Descriptive answer text',
    type: 'string',
    example: 'The answer is four.',
  })
  answerText: string;
}

enum QuestionTypeEnum {
  SELECT_ONE_IN_LOT = 'SELECT_ONE_IN_LOT',
  SELECT_MANY_IN_LOT = 'SELECT_MANY_IN_LOT',
  ORDER_THE_LOTS = 'ORDER_THE_LOTS',
  NUMERIC_ANSWER_TYPE = 'NUMERIC_ANSWER_TYPE',
  DESCRIPTIVE = 'DESCRIPTIVE',
}

class QuestionAnswer implements IQuestionAnswer {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question',
    type: 'string',
    example: '60d21b4667d0d8992e610c02',
  })
  questionId: string;

  @IsString()
  @JSONSchema({
    description: 'Type of the question',
    type: 'string',
    enum: [
      'SELECT_ONE_IN_LOT',
      'SELECT_MANY_IN_LOT',
      'ORDER_THE_LOTS',
      'NUMERIC_ANSWER_TYPE',
      'DESCRIPTIVE',
    ],
    example: 'SELECT_ONE_IN_LOT',
  })
  questionType: QuestionType;

  @JSONSchema({
    description: 'Answer for the question',
    oneOf: [
      {
        $ref: '#/components/schemas/SOLAnswer',
        title: 'Select One in Lot Answer',
        description: 'Commonly reffered as MCQ (Multiple Choice Question)',
      },
      {
        $ref: '#/components/schemas/SMLAnswer',
        title: 'Select Many in Lot Answer',
        description: 'Commonly reffered as MSQ (Multiple Select Question)',
      },
      {
        $ref: '#/components/schemas/OTLAnswer',
        title: 'Order the Lots Answer',
      },
      {
        $ref: '#/components/schemas/NATAnswer',
        title: 'Numeric Answer Type',
      },
      {
        $ref: '#/components/schemas/DESAnswer',
        title: 'Descriptive Answer',
      },
    ],
  })
  @ValidateNested()
  @Type((type) => {

    if (!type) {
      return SOLAnswer;
    }

    switch (type.object.questionType as QuestionType) {
      case 'SELECT_ONE_IN_LOT':
        return SOLAnswer;
      case 'SELECT_MANY_IN_LOT':
        return SMLAnswer;
      case 'ORDER_THE_LOTS':
        return OTLAnswer;
      case 'NUMERIC_ANSWER_TYPE':
        return NATAnswer;
      case 'DESCRIPTIVE':
        return DESAnswer;
      default:
        throw new Error(`Unsupported question type: ${type.object.questionType}`);
    }
  })
  @IsNotEmpty()
  answer: Answer;
}

class QuestionDetails implements IQuestionDetails {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question',
    type: 'string',
    example: '60d21b4667d0d8992e610c02',
  })
  questionId: string | ObjectId;

  @IsOptional()
  @JSONSchema({
    description: 'Parameter map for the question',
    type: 'object',
    additionalProperties: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    example: { difficulty: 'easy', maxScore: 10 }
  })
  parameterMap?: ParameterMap;
}

class QuestionAnswersBody {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswer)
  @JSONSchema({
    description: 'Array of answers for the quiz',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionAnswer' },
  })
  answers: QuestionAnswer[];
}

@JSONSchema({
  description: 'Map of string keys to string or number values',
  additionalProperties: {
    oneOf: [{ type: 'string' }, { type: 'number' }],
  },
  example: {
    difficulty: 'easy',
    maxScore: 10,
  },
})
export class ParameterMapValidator {
  @IsOptional()
  __dummy?: any;

  [key: string]: string | number;
}

@JSONSchema({
  description: 'A lot item used for rendering (excludes explanation)',
  type: 'object',
  example: {
    _id: '60d21b4667d0d8992e610c01',
    text: 'Option A'
  }
})
class LotItemRenderViewValidator {
  @IsOptional()
  @IsMongoId()
  @JSONSchema({
    description: 'Mongo ID of the item',
    type: 'string',
    example: '60d21b4667d0d8992e610c01'
  })
  _id?: string;

  @IsString()
  @JSONSchema({
    description: 'Text for the item',
    type: 'string',
    example: 'Option A'
  })
  text: string;
}

class QuestionRenderView extends Question implements IQuestionRenderView {
  @IsOptional()
  @ValidateNested()
  @Type(() => ParameterMapValidator)
  @JSONSchema({
    description: 'Dynamic parameters for the question',
    additionalProperties: { oneOf: [{ type: 'string' }, { type: 'number' }] },
    example: { difficulty: 'easy', maxScore: 10 },
    $ref: '#/components/schemas/ParameterMapValidator'
  })
  parameterMap?: ParameterMap;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LotItemRenderViewValidator)
  @JSONSchema({
    description: 'Options to display for the question',
    type: 'array',
    items: { $ref: '#/components/schemas/LotItemRenderViewValidator' },
    example: [
      {
        _id: '60d21b4667d0d8992e610c01',
        text: 'Option A'
      },
      {
        _id: '60d21b4667d0d8992e610c02',
        text: 'Option B'
      }
    ]
  })
  lotItems?: ILotItemRenderView[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @JSONSchema({
    description: 'Allowed decimal places for numeric input',
    type: 'integer',
    example: 2,
    minimum: 0,
    maximum: 10
  })
  decimalPrecision?: number;
}

// Response Schemas
class CreateAttemptResponse {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string;

  @IsMongoId()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionRenderView)
  @JSONSchema({
    description: 'Rendered questions for this attempt',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionRenderView' },
  })
  questionRenderViews: QuestionRenderView[];
}

class SubmitAttemptResponse implements Partial<IGradingResult> {
  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Score obtained',
    type: 'number',
    example: 8,
  })
  totalScore?: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Maximum score',
    type: 'number',
    example: 10,
  })
  totalMaxScore?: number;

  @IsMongoId()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerFeedback)
  @JSONSchema({
    description: 'Question-wise feedback',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionAnswerFeedback' },
  })
  overallFeedback?: IQuestionAnswerFeedback[];

  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Result status',
    type: 'string',
    enum: ['PENDING', 'PASSED', 'FAILED'],
    example: 'PASSED',
  })
  gradingStatus: any;

  @IsDateString()
  @IsOptional()
  @JSONSchema({
    description: 'Grading timestamp',
    example: '2024-06-18T12:30:00.000Z',
  })
  gradedAt?: Date;

  @IsString()
  @IsOptional()
  @JSONSchema({
    description: 'Evaluator name',
    type: 'string',
    example: 'admin',
  })
  gradedBy?: string;
}

class QuizIdParam {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;
}

class QuizAttemptParam {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the attempt',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string;
}

class QuizSubmissionParam {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the submission',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  submissionId: string;
}

class UpdateQuizSubmissionParam {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the submission',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  submissionId: string;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Score to update',
    type: 'number',
    example: 8,
  })
  score: number;
}

class RemoveQuestionBankParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question bank',
    type: 'string',
    example: '60d21b4667d0d8992e610c88',
  })
  questionBankId: string;
}

class AddFeedbackParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the submission',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  submissionId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question',
    type: 'string',
    example: '60d21b4667d0d8992e610c02',
  })
  questionId: string;
}

class GetUserMatricesParams {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the user',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string;
}

class AddQuestionBankBody implements QuestionBankRef {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question bank',
    type: 'string',
    example: '60d21b4667d0d8992e610c88',
  })
  bankId: string;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Number of questions to pick',
    type: 'number',
    example: 10,
  })
  count: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Difficulty filters',
    type: 'array',
    items: { type: 'string', example: 'easy' },
    example: ['easy', 'medium'],
  })
  difficulty?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Tags filters',
    type: 'array',
    items: { type: 'string', example: 'math' },
    example: ['math', 'science'],
  })
  tags?: string[];
}

class EditQuestionBankBody implements Partial<QuestionBankRef> {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question bank',
    type: 'string',
    example: '60d21b4667d0d8992e610c88',
  })
  bankId: string;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Number of questions to pick',
    type: 'number',
    example: 10,
  })
  count: number;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Difficulty filters',
    type: 'array',
    items: { type: 'string', example: 'easy' },
    example: ['easy', 'medium'],
  })
  difficulty?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Tags filters',
    type: 'array',
    items: { type: 'string', example: 'math' },
    example: ['math', 'science'],
  })
  tags?: string[];
}

class RegradeSubmissionBody implements Partial<IGradingResult> {
  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Total score after regrading',
    type: 'number',
    example: 8,
  })
  totalScore?: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Maximum possible score after regrading',
    type: 'number',
    example: 10,
  })
  totalMaxScore?: number;

  @IsOptional()
  @JSONSchema({
    description: 'Overall feedback after regrading',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionAnswerFeedback' },
  })
  overallFeedback?: IQuestionAnswerFeedback[];

  @IsEnum(['PENDING', 'PASSED', 'FAILED'])
  @IsNotEmpty()
  @JSONSchema({
    description: 'Grading status after regrading',
    type: 'string',
    enum: ['PENDING', 'PASSED', 'FAILED'],
    example: 'PASSED',
  })
  gradingStatus: 'PENDING' | 'PASSED' | 'FAILED' | any;
}

class AddFeedbackBody {
  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Feedback text',
    type: 'string',
    example: 'Great answer!',
  })
  feedback: string;
}

class AttemptDetails implements IAttemptDetails {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the attempt',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string | ObjectId;

  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'ID of the submission result',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  submissionResultId?: string | ObjectId;
}

class UserQuizMetricsResponse implements IUserQuizMetrics {
  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'Metrics record ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  _id?: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Quiz ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string | ObjectId;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Latest attempt status',
    type: 'string',
    enum: ['ATTEMPTED', 'SUBMITTED'],
    example: 'ATTEMPTED',
  })
  latestAttemptStatus: 'ATTEMPTED' | 'SUBMITTED';

  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'Latest attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  latestAttemptId?: string | ObjectId;

  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'Latest submission result ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  latestSubmissionResultId?: string | ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Remaining attempts',
    type: 'number',
    example: 2,
  })
  remainingAttempts: number;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AttemptDetails)
  @JSONSchema({
    description: 'Quiz attempt history',
    type: 'array',
    items: { $ref: '#/components/schemas/AttemptDetails' },
  })
  attempts: IAttemptDetails[];
}

class QuizAttemptResponse implements IAttempt {
  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  _id?: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Quiz ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string | ObjectId;

  @IsNotEmpty()
  @Type(() => QuestionDetails)
  @ValidateNested({ each: true })
  @JSONSchema({
    description: 'Questions in the quiz',
    type: 'array',
    items: { type: 'object' },
  })
  questionDetails: IQuestionDetails[];

  @IsOptional()
  @Type(() => QuestionAnswer)
  @ValidateNested({ each: true })
  @JSONSchema({
    description: 'Submitted answers',
    type: 'array',
    items: { type: 'object' },
  })
  answers?: IQuestionAnswer[];

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Created on',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:00:00.000Z',
  })
  createdAt: Date;

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Last updated on',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:30:00.000Z',
  })
  updatedAt: Date;
}

class GradingResult implements IGradingResult {
  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Score awarded',
    type: 'number',
    example: 8,
  })
  totalScore?: number;

  @IsNumber()
  @IsOptional()
  @JSONSchema({
    description: 'Maximum possible score',
    type: 'number',
    example: 10,
  })
  totalMaxScore?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionAnswerFeedback)
  @JSONSchema({
    description: 'Feedback per question',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionAnswerFeedback' },
  })
  overallFeedback?: IQuestionAnswerFeedback[];

  @IsEnum(['PENDING', 'PASSED', 'FAILED'])
  @IsNotEmpty()
  @JSONSchema({
    description: 'Grading status',
    type: 'string',
    enum: ['PENDING', 'PASSED', 'FAILED'],
    example: 'PASSED',
  })
  gradingStatus: 'PENDING' | 'PASSED' | 'FAILED' | any;

  @IsDateString()
  @IsOptional()
  @JSONSchema({
    description: 'Grading timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:30:00.000Z',
  })
  gradedAt?: Date;

  @IsString()
  @IsOptional()
  @JSONSchema({
    description: 'Graded by',
    type: 'string',
    example: 'Teacher',
  })
  gradedBy?: string;
}

class QuizSubmissionResponse implements ISubmission {
  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'Submission ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  _id?: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Quiz ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string | ObjectId;

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Submitted on',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:45:00.000Z',
  })
  submittedAt: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => GradingResult)
  @JSONSchema({
    description: 'Grading result',
    type: 'object',
  })
  gradingResult?: IGradingResult;
}

class QuizDetails implements IQuizDetails {
  @ValidateNested({ each: true })
  @Type(() => QuestionBankRef)
  @IsArray()
  @IsNotEmpty()
  @JSONSchema({
    description: 'List of question banks referenced in the quiz',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionBankRef' },
  })
  questionBankRefs: IQuestionBankRef[]; // question ids

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Passing threshold for the quiz',
    type: 'number',
    example: 0.7,
  })
  passThreshold: number; // 0-1

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Maximum number of attempts allowed',
    type: 'number',
    example: 3,
  })
  maxAttempts: number; // Maximum number of attempts allowed

  @IsEnum(['DEADLINE', 'NO_DEADLINE'])
  @IsNotEmpty()
  @JSONSchema({
    description: 'Type of the quiz',
    type: 'string',
    enum: ['DEADLINE', 'NO_DEADLINE'],
    example: 'DEADLINE',
  })
  quizType: 'DEADLINE' | 'NO_DEADLINE'; // Type of quiz

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Release time for the quiz',
    example: '2024-06-18T12:00:00.000Z',
  })
  releaseTime: Date; // Release time for the quiz

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Number of questions visible to the user at a time',
    type: 'number',
    example: 5,
  })
  questionVisibility: number; // Number of questions visible to the user at a time

  @IsDateString()
  @IsOptional()
  @JSONSchema({
    description: 'Deadline for the quiz, only applicable for DEADLINE type',
    example: '2024-06-25T12:00:00.000Z',
  })
  deadline?: Date; // Deadline for the quiz, only applicable for DEADLINE type

  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Approximate time to complete the quiz',
    type: 'string',
    example: '01:30:00',
  })
  approximateTimeToComplete: string; // Approximate time to complete in HH:MM:SS format

  @IsBoolean()
  @IsNotEmpty()
  @JSONSchema({
    description: 'If true, allows partial grading for SML questions',
    type: 'boolean',
    example: true,
  })
  allowPartialGrading: boolean; // If true, allows partial grading for questions

  @IsBoolean()
  @IsNotEmpty()
  @JSONSchema({
    description: 'If true, allows users to use hints for questions',
    type: 'boolean',
    example: false,
  })
  allowHint: boolean; // If true, allows users to use hints for questions

  @IsBoolean()
  @IsNotEmpty()
  @JSONSchema({
    description: 'If true, shows correct answers after submission',
    type: 'boolean',
    example: true,
  })
  showCorrectAnswersAfterSubmission: boolean; // If true, shows correct answers after submission

  @IsBoolean()
  @IsNotEmpty()
  @JSONSchema({
    description: 'If true, shows explanation after submission',
    type: 'boolean',
    example: true,
  })
  showExplanationAfterSubmission: boolean; // If true, shows explanation after submission

  @IsBoolean()
  @IsNotEmpty()
  @JSONSchema({
    description: 'If true, shows score after submission',
    type: 'boolean',
    example: true,
  })
  showScoreAfterSubmission: boolean; // If true, shows score after submission
}

class QuizDetailsResponse {
  @IsMongoId()
  @IsOptional()
  @JSONSchema({
    description: 'ID of the quiz',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  _id?: string | ObjectId;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Name of the quiz',
    type: 'string',
    example: 'Algebra Quiz',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Description of the quiz',
    type: 'string',
    example: 'A quiz on algebra basics.',
  })
  description: string;

  @IsEnum(ItemType)
  @IsNotEmpty()
  @JSONSchema({
    description: 'Type of the quiz',
    type: 'string',
    enum: Object.values(ItemType),
    example: 'QUIZ',
  })
  type: ItemType;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuizDetails)
  @JSONSchema({
    description: 'Quiz details',
  })
  details?: IQuizDetails;
}

class QuizAnalyticsResponse {
  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Total attempts',
    type: 'number',
    example: 100,
  })
  totalAttempts: number;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Total submissions',
    type: 'number',
    example: 80,
  })
  submissions: number;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Pass percentage',
    type: 'number',
    example: 75,
  })
  passRate: number;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Average score',
    type: 'number',
    example: 7.5,
  })
  averageScore: number;
}

class QuizPerformanceResponse {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Question ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c02',
  })
  questionId: string;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Correct response rate (%)',
    type: 'number',
    example: 80,
  })
  correctRate: number;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Average question score',
    type: 'number',
    example: 4.2,
  })
  averageScore: number;
}

class QuizResultsResponse {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Student ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  studentId: string | ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string | ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt score',
    type: 'number',
    example: 9,
  })
  score: number;

  @IsEnum(['PENDING', 'PASSED', 'FAILED'])
  @IsNotEmpty()
  @JSONSchema({
    description: 'Grading status',
    type: 'string',
    enum: ['PENDING', 'PASSED', 'FAILED'],
    example: 'PASSED',
  })
  status: 'PENDING' | 'PASSED' | 'FAILED' | any;
}

class FlaggedQuestionResponse {
  // Not yet implemented
}

class SubmissionResponse implements ISubmission {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Submission ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c77',
  })
  _id: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Quiz ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c85',
  })
  quizId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'User ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c01',
  })
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Attempt ID',
    type: 'string',
    example: '60d21b4667d0d8992e610c99',
  })
  attemptId: string;

  @IsDateString()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Submitted on',
    type: 'string',
    format: 'date-time',
    example: '2024-06-18T12:45:00.000Z',
  })
  submittedAt: Date;

  @IsOptional()
  @JSONSchema({
    description: 'Grading result',
    type: 'object',
  })
  @Type(() => GradingResult)
  @ValidateNested()
  gradingResult?: IGradingResult;s
}

class GetAllSubmissionsResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionResponse)
  @IsNotEmpty()
  @JSONSchema({
    description: 'Submissions list',
    type: 'array',
    items: { type: 'object' },
  })
  submissions: SubmissionResponse[];
}

class QuestionBankRefResponse implements IQuestionBankRef {
  @IsMongoId()
  @IsNotEmpty()
  @JSONSchema({
    description: 'ID of the question bank',
    type: 'string',
    example: '60d21b4667d0d8992e610c88',
  })
  bankId: string;

  @IsNumber()
  @IsNotEmpty()
  @JSONSchema({
    description: 'Number of questions to pick',
    type: 'number',
    example: 10,
  })
  count: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Difficulty filters',
    type: 'array',
    items: { type: 'string', example: 'easy' },
    example: ['easy', 'medium'],
  })
  difficulty?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @JSONSchema({
    description: 'Tags filters',
    type: 'array',
    items: { type: 'string', example: 'math' },
    example: ['math', 'science'],
  })
  tags?: string[];

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Type filter',
    type: 'string',
    example: 'MCQ',
  })
  type?: string;
}

class AttemptNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message.',
    example:
      'No attempt found.',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

class QuizNotFoundErrorResponse {
  @JSONSchema({
    description: 'The error message.',
    example: 'Quiz not found.',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

class GetAllQuestionBanksResponse {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionBankRefResponse)
  @JSONSchema({
    description: 'List of all question banks',
    type: 'array',
    items: { $ref: '#/components/schemas/QuestionBankRef' },
  })
  questionBanks: IQuestionBankRef[];
}

export {
  CreateAttemptParams,
  SaveAttemptParams,
  SubmitAttemptParams,
  CreateAttemptResponse,
  SubmitAttemptResponse,
  GetAttemptResponse,
  QuestionAnswersBody,
  AddQuestionBankBody,
  EditQuestionBankBody,
  RegradeSubmissionBody,
  AddFeedbackBody,
  QuizIdParam,
  QuizAttemptParam,
  QuizSubmissionParam,
  UpdateQuizSubmissionParam,
  RemoveQuestionBankParams,
  GetUserMatricesParams,
  AddFeedbackParams,
  UserQuizMetricsResponse,
  QuizAttemptResponse,
  QuizSubmissionResponse,
  SubmissionResponse,
  QuizDetailsResponse,
  QuizAnalyticsResponse,
  QuizPerformanceResponse,
  QuizResultsResponse,
  FlaggedQuestionResponse,
  AttemptNotFoundErrorResponse,
  GetAllSubmissionsResponse,
  QuizNotFoundErrorResponse,
  GetAllQuestionBanksResponse
};

export const QUIZ_VALIDATORS = [
  CreateAttemptParams,
  SaveAttemptParams,
  SubmitAttemptParams,
  CreateAttemptResponse,
  SubmitAttemptResponse,
  GetAttemptResponse,
  QuestionAnswersBody,
  AddQuestionBankBody,
  EditQuestionBankBody,
  RegradeSubmissionBody,
  AddFeedbackBody,
  QuizIdParam,
  QuizAttemptParam,
  QuizSubmissionParam,
  UpdateQuizSubmissionParam,
  RemoveQuestionBankParams,
  GetUserMatricesParams,
  AddFeedbackParams,
  UserQuizMetricsResponse,
  QuizAttemptResponse,
  QuizSubmissionResponse,
  SubmissionResponse,
  QuizDetailsResponse,
  QuizAnalyticsResponse,
  QuizPerformanceResponse,
  QuizResultsResponse,
  FlaggedQuestionResponse,
  AttemptNotFoundErrorResponse,
  GetAllSubmissionsResponse,
  QuizNotFoundErrorResponse,
  GetAllQuestionBanksResponse
]