import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

import { Logger } from '../utils/log4js/index';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    // console.log('filter...');
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse<Response>(); // 获取响应对象
    const status = exception.getStatus(); // 获取异常状态码
    const exceptionResponse = exception.getResponse(); // 获取异常响应内容

    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object); // 获取异常响应内容
    let res = null
    if (typeof error === 'string') res = { message: error };
    else res = { ...error };
    Logger.error(res)
    response.status(status).json({
      code: -1,
      ...res,
      timestamp: new Date().getTime(),
    });
  }
}
