import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { FieldValidationException, InvalidRequestDataException } from './validation';

/**
 * Same error shapes as the Spring GlobalExceptionHandler:
 *  - validation   -> 400 {"weight": "Weight must be greater than zero", ...}
 *  - bad body     -> 400 {"error": "Invalid request data. Check category and numeric values."}
 *  - anything else-> 500 {"error": "Something went wrong"}
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof FieldValidationException) {
      return res.status(400).json(exception.fieldErrors);
    }
    if (exception instanceof InvalidRequestDataException) {
      return res.status(400).json({ error: exception.message });
    }
    // malformed JSON from body-parser, or other 400s
    if (exception instanceof BadRequestException) {
      return res
        .status(400)
        .json({ error: 'Invalid request data. Check category and numeric values.' });
    }
    if (exception instanceof HttpException) {
      return res
        .status(exception.getStatus())
        .json({ error: exception.message });
    }
    this.logger.error(exception);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
