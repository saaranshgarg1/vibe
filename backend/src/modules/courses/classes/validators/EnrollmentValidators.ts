import 'reflect-metadata';
import {IsMongoId, IsString} from 'class-validator';

/**
 * Route parameters for enrolling a user in a course version.
 *
 * @category Courses/Validators/EnrollmentValidators
 */
export class EnrollmentParams {
  /**
   * MongoDB ObjectId of the user to enroll.
   */
  @IsMongoId()
  @IsString()
  userId: string;

  /**
   * MongoDB ObjectId of the course.
   */
  @IsMongoId()
  @IsString()
  courseId: string;

  /**
   * MongoDB ObjectId of the course version.
   */
  @IsMongoId()
  @IsString()
  courseVersionId: string;
}
