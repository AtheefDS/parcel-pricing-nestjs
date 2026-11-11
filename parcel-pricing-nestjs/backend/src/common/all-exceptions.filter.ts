
// Import NestJS classes and decorators needed for exception handling
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

// Import Express Response type to send HTTP responses
import { Response } from 'express';

// Import our custom validation exceptions
import {
  FieldValidationException,
  InvalidRequestDataException
} from './validation';

// Catch all types of exceptions in this filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  // Create a logger to display error information in the terminal
  private readonly logger = new Logger(AllExceptionsFilter.name);

  // This method runs whenever an exception is caught
  catch(exception: unknown, host: ArgumentsHost) {

    // Get the HTTP response object
    const res = host.switchToHttp().getResponse<Response>();

    // Check whether the error is a field validation error
    if (exception instanceof FieldValidationException) {

      // Return status 400 with individual field errors
      return res.status(400).json(exception.fieldErrors);
    }

    // Check whether the entire request data is invalid
    if (exception instanceof InvalidRequestDataException) {

      // Return status 400 with the exception message
      return res.status(400).json({ error: exception.message });
    }

    // Check whether the error is a bad request error
    if (exception instanceof BadRequestException) {

      // Return a custom bad request message
      return res
        .status(400)
        .json({
          error: 'Invalid request data. Check category and numeric values.'
        });
    }

    // Check whether the error is another NestJS HTTP exception
    if (exception instanceof HttpException) {

      // Return the original HTTP status and error message
      return res
        .status(exception.getStatus())
        .json({ error: exception.message });
    }

    // Print unexpected errors in the terminal
    this.logger.error(exception);

    // Return status 500 for unexpected errors
    return res.status(500).json({
      error: 'Something went wrong'
    });
  }
}
