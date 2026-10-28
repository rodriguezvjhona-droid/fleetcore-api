import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Error interno del servidor';

    if (exception instanceof HttpException) {
    statusCode = exception.getStatus();
    const errorResponse = exception.getResponse();
    message =
        typeof errorResponse === 'object' && errorResponse !== null
    ? (errorResponse as any).message || errorResponse
    : errorResponse;
    } else if (exception instanceof Error) {
    message = exception.message;
    }

    response.status(statusCode).json({
    success: false,
    statusCode,
    message,
    path: request.url,
    timestamp: new Date().toISOString(),
    });
    }
}
