import 'reflect-metadata';
import {
  Authorized,
  Body,
  JsonController,
  Params,
  Post,
  HttpError,
} from 'routing-controllers';
import {CourseRepository} from 'shared/database/providers/mongo/repositories/CourseRepository';
import {Inject, Service} from 'typedi';
import {EnrollmentParams} from '../classes/validators/EnrollmentValidators';
import {ObjectId} from 'mongodb';
import {ItemNotFoundError} from 'shared/errors/errors';
import {instanceToPlain} from 'class-transformer';

/**
 * Controller for managing user enrollments in courses.
 * Handles operations related to user enrollment and progress tracking.
 *
 * @category Courses/Controllers
 * @categoryDescription
 * Provides endpoints for enrolling users in courses and tracking their progress.
 */
@JsonController('/users')
@Service()
export class EnrollmentController {
  constructor(
    @Inject('NewCourseRepo') private readonly courseRepo: CourseRepository,
  ) {}

  /**
   * Enroll a user in a specific course version.
   * Creates enrollment record and initializes progress tracking.
   *
   * @param params - Route parameters including userId, courseId and courseVersionId
   * @returns The created enrollment and progress records
   *
   * @throws HttpError(404) if course version is not found
   * @throws HttpError(500) on enrollment failure
   *
   * @category Courses/Controllers
   */
  @Authorized(['admin', 'instructor', 'student'])
  @Post('/:userId/enrollment/courses/:courseId/versions/:courseVersionId')
  async enrollUserInCourse(@Params() params: EnrollmentParams) {
    const {userId, courseId, courseVersionId} = params;

    try {
      // Verify the course version exists
      const courseVersion = await this.courseRepo.readVersion(courseVersionId);
      if (!courseVersion) {
        throw new ItemNotFoundError('Course version not found');
      }

      // Get first module, section and item by order
      const firstItems =
        await this.courseRepo.getFirstOrderItems(courseVersionId);

      // Create enrollment record
      const enrollment = await this.courseRepo.createEnrollment({
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
        courseVersionId: new ObjectId(courseVersionId),
        status: 'active',
        enrollmentDate: new Date(),
      });

      // Create progress record
      const progress = await this.courseRepo.createProgress({
        userId: new ObjectId(userId),
        courseId: new ObjectId(courseId),
        courseVersionId: new ObjectId(courseVersionId),
        currentModule: firstItems.moduleId,
        currentSection: firstItems.sectionId,
        currentItem: firstItems.itemId,
      });

      return {
        enrollment: instanceToPlain(enrollment),
        progress: instanceToPlain(progress),
      };
    } catch (error) {
      if (error instanceof ItemNotFoundError) {
        throw new HttpError(404, error.message);
      }
      throw new HttpError(500, `Failed to enroll user: ${error.message}`);
    }
  }
}
