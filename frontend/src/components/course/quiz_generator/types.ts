export interface QuizMetadata {
  passThreshold: number;
  maxAttempts: number;
  quizType: 'DEADLINE' | 'NO_DEADLINE';
  releaseTime?: Date;
  questionVisibility: number;
  deadline?: Date;
  approximateTimeToComplete: string;
  allowPartialGrading: boolean;
  allowHint: boolean;
  showCorrectAnswersAfterSubmission: boolean;
  showExplanationAfterSubmission: boolean;
  showScoreAfterSubmission: boolean;
}


export interface QuizQuestion {
  id: string;
  type: 'SELECT_ONE_IN_LOT' | 'SELECT_MANY_IN_LOT' | 'NUMERIC_ANSWER_TYPE' | 'DESCRIPTIVE' | 'ORDER_THE_LOTS';
  question: string;
  options?: string[];
  correctAnswerIndex?: number;  // Added for single correct option
  points: number;
  timeLimit?: number;           // Time limit in seconds (stored as number)
  hint?: string;
  decimalPrecision?: number;
  expression?: string;
  lotItems?: Array<{
    text: string;
    explaination: string;
    _id: { buffer: { type: string; data: number[] } } | string;
  }>;
}


