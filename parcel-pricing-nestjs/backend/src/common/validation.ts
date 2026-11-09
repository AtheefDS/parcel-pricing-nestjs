import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

/** Thrown for malformed bodies (wrong types / bad enum). Mirrors Spring's HttpMessageNotReadableException. */
export class InvalidRequestDataException extends BadRequestException {
  constructor() {
    super('Invalid request data. Check category and numeric values.');
  }
}

/** Thrown for field-level rule failures. Mirrors Spring's MethodArgumentNotValidException ({field: message}). */
export class FieldValidationException extends BadRequestException {
  constructor(public readonly fieldErrors: Record<string, string>) {
    super('Validation failed');
  }
}

const TYPE_CONSTRAINTS = ['isEnum', 'isNumber'];

export function buildValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true, // unknown JSON properties are ignored, like Jackson/records
    transform: false,
    exceptionFactory: (errors: ValidationError[]) => {
      const fieldErrors: Record<string, string> = {};
      for (const err of errors) {
        const c = err.constraints ?? {};
        // wrong type / unknown enum value -> generic "invalid request data"
        if (!('isDefined' in c) && TYPE_CONSTRAINTS.some((k) => k in c)) {
          return new InvalidRequestDataException();
        }
        const message = c['isDefined'] ?? Object.values(c)[0];
        if (message) fieldErrors[err.property] = message;
      }
      return new FieldValidationException(fieldErrors);
    },
  });
}
