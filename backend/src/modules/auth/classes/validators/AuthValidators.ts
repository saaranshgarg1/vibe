/**
 * @file AuthValidators.ts
 * @description Validation classes for authentication-related payloads.
 *
 * @category Auth/Validators
 * @categoryDescription
 * Validation classes for authentication-related payloads.
 * Includes DTOs for user signup and password change.
 */

import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  IsString,
} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';

/**
 * Data Transfer Object (DTO) for user registration.
 * Validates that the required fields meet the criteria for creating a new account.
 *
 * @category Auth/Validators
 */
class SignUpBody {
  /**
   * The email address of the new user.
   * Must be a valid email format as defined by the IsEmail validator.
   * Used as the primary login identifier and for account recovery.
   */
  @JSONSchema({
    title: 'Email Address',
    description: 'Email address of the user, used as login identifier',
    example: 'user@example.com',
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  email: string;

  /**
   * The password for the new account.
   * Must be at least 8 characters long.
   * Used for authenticating the user on subsequent logins.
   */
  @JSONSchema({
    title: 'Password',
    description: 'Password for account authentication (minimum 8 characters)',
    example: 'SecureP@ssw0rd',
    type: 'string',
    minLength: 8,
    format: 'password',
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  /**
   * The first name of the user.
   * Must contain only alphabetic characters (no numbers or special characters).
   * Used for personalization and display purposes.
   */
  @JSONSchema({
    title: 'First Name',
    description: "User's first name (alphabetic characters only)",
    example: 'John',
    type: 'string',
    pattern: '^[a-zA-Z]+$',
  })
  @IsAlpha()
  firstName: string;

  /**
   * The last name of the user.
   * Must contain only alphabetic characters (no numbers or special characters).
   * Used for personalization and display purposes.
   */
  @JSONSchema({
    title: 'Last Name',
    description: "User's last name (alphabetic characters only)",
    example: 'Smith',
    type: 'string',
    pattern: '^[a-zA-Z]+$',
  })
  @IsAlpha()
  lastName: string;
}

/**
 * Data Transfer Object (DTO) for password change requests.
 * Validates that the new password meets security requirements
 * and that the confirmation matches.
 *
 * @category Auth/Validators
 */
class ChangePasswordBody {
  /**
   * The new password to set for the user account.
   * Must meet strong password requirements:
   * - At least 8 characters long
   * - Contains at least one uppercase letter
   * - Contains at least one lowercase letter
   * - Contains at least one number
   * - Contains at least one special character
   */
  @JSONSchema({
    title: 'New Password',
    description: 'New password that meets security requirements',
    example: 'SecureP@ssw0rd',
    type: 'string',
    format: 'password',
    minLength: 8,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  newPassword: string;

  /**
   * Confirmation of the new password.
   * Must exactly match the newPassword field to ensure the user
   * hasn't made a typing error.
   * This field is compared against newPassword during validation in the service layer.
   */
  @JSONSchema({
    title: 'Confirm New Password',
    description: 'Confirmation of the new password (must match exactly)',
    example: 'SecureP@ssw0rd',
    type: 'string',
    format: 'password',
    minLength: 8,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  newPasswordConfirm: string;
}

/**
 * Response for successful user signup.
 *
 * @category Auth/Validators
 */
class SignUpResponse {
  @JSONSchema({
    description: 'Unique identifier for the user',
    example: 'cKy6H2O04PgTh8O3DpUXjgJYUr53',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  uid: string;

  @JSONSchema({
    description: 'Email address of the registered user',
    example: 'user@example.com',
    type: 'string',
    format: 'email',
    readOnly: true,
  })
  @IsEmail()
  email: string;

  @JSONSchema({
    description: "User's first name",
    example: 'John',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  firstName: string;

  @JSONSchema({
    description: "User's last name",
    example: 'Smith',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  lastName: string;
}

/**
 * Response for successful password change.
 *
 * @category Auth/Validators
 */
class ChangePasswordResponse {
  @JSONSchema({
    description: 'Indicates the operation was successful',
    example: true,
    type: 'boolean',
    readOnly: true,
  })
  @IsNotEmpty()
  success: boolean;

  @JSONSchema({
    description: 'Success message',
    example: 'Password changed successfully',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  message: string;
}

/**
 * Response for token verification.
 *
 * @category Auth/Validators
 */
class TokenVerificationResponse {
  @JSONSchema({
    description: 'Confirmation message for valid token',
    example: 'Token is valid',
    type: 'string',
    readOnly: true,
  })
  @IsString()
  message: string;
}

/**
 * Response for authentication errors.
 *
 * @category Auth/Validators
 */
class AuthErrorResponse {
  @JSONSchema({
    description: 'The error message',
    example: 'Invalid credentials. Please check your email and password.',
    type: 'string',
    readOnly: true,
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export {
  SignUpBody,
  ChangePasswordBody,
  SignUpResponse,
  ChangePasswordResponse,
  TokenVerificationResponse,
  AuthErrorResponse,
};
