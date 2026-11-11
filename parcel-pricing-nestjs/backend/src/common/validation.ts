
import {
  BadRequestException, // Creates an HTTP 400 error
  ValidationError,     // Represents a validation error
  ValidationPipe       // Validates incoming request data
} from '@nestjs/common';

// Custom exception for invalid request data
export class InvalidRequestDataException extends BadRequestException {

  // Constructor runs when this exception is created
  constructor() {

    // Call parent constructor and set the error message
    super('Invalid request data. Check category and numeric values.');
  }
}

// Custom exception for individual field errors
export class FieldValidationException extends BadRequestException {

  // Store field errors and make them accessible outside the class
  constructor(public readonly fieldErrors: Record<string, string>) {

    // Initialize the parent exception
    super('Validation failed');
  }
}

// Store type-related validation constraint names
const TYPE_CONSTRAINTS = ['isEnum', 'isNumber'];

// Create and return a reusable validation pipe
export function buildValidationPipe(): ValidationPipe {

  // Create a new ValidationPipe with custom settings
  return new ValidationPipe({

    // Remove properties that are not defined in the DTO
    whitelist: true,

    // Do not automatically transform request values
    transform: false,

    // Customize the exception created when validation fails
    exceptionFactory: (errors: ValidationError[]) => {

      // Create an empty object to store field error messages
      const fieldErrors: Record<string, string> = {};

      // Check every validation error one by one
      for (const err of errors) {

        // Get failed constraints, or use an empty object
        const c = err.constraints ?? {};

        // Check for invalid type or enum values
        if (
          !('isDefined' in c) &&
          TYPE_CONSTRAINTS.some((k) => k in c)
        ) {

          // Return a generic invalid request exception
          return new InvalidRequestDataException();
        }

        // Get the required-field message or the first available message
        const message = c['isDefined'] ?? Object.values(c)[0];

        // Store the error message using the field name
        if (message) {
          fieldErrors[err.property] = message;
        }
      }

      // Return all collected field validation errors
      return new FieldValidationException(fieldErrors);
    },
  });
}
