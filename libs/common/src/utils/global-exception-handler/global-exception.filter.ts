import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (response.headersSent) {
      return;
    }
    // Default status code and error message
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = exception.getResponse() as string;
    } else if (exception instanceof Error) {
      errorMessage = exception.message as string;
      console.error(exception.message);
    }

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
    });
  }
}
