import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { map, Observable } from 'rxjs';
import { CommonResponse } from './transform.interceptor';
import { Logger } from '../utils/log4js/index';
import { desensitizationFn } from '../utils/desensitization';
/**
 * 所有的拦截器都应该实现从@nestjs/common导出的`NestInterceptor`接口
 */
@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    Logger.log(`收到请求 ---> ${req.route.path}`);
    return next.handle().pipe(
      map((data) => {
        data = desensitizationFn(data)
        if (data?.response?.statusCode) {
          Logger.fatal(`响应失败fatal ---> ${req.route.path}`);
          return {
            code: -1,
            ...data.response,
          };
        }
        Logger.log(`响应成功 ---> ${req.route.path}`);
        return {
          code: 0,
          ...data,
        };
      }),
    );
  }
}


type ApiResponseMetadata<T> = ApiPropertyOptions & {
  type: Type<T> | Function | [Function] | string | Record<string, any>;
};

export const warpResponse = <T, U extends Type<CommonResponse<T>>>(
  options: ApiResponseMetadata<T>,
): U => {
  const typeName = (() => {
    if (typeof options.type === 'string') {
      return options.type;
    } else if (options.type instanceof Array) {
      return options.type[0].name;
    } else {
      return options.type.name;
    }
  })();
  class TempClass<T> extends CommonResponse<T> {
    @ApiProperty(options)
    data: T;
  }
  Object.defineProperty(TempClass, 'name', { writable: true });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TempClass.name = `Response<${typeName}>`;
  return TempClass as U;
};

// export const SwaggerPagerOk = <TModel extends Type<any>>(model: TModel) => {
//   const decorators = [
//     ApiExtraModels(ApiPagerOkRes),
//     ApiExtraModels(model),
//     ApiResponse({
//       description: API_MSGS[API_CODES.OK],
//       status: API_CODES.OK,
//       schema: {
//         allOf: [
//           { $ref: getSchemaPath(ApiPagerOkRes) },
//           {
//             properties: {
//               list: {
//                 type: 'array',
//                 items: { $ref: getSchemaPath(model) },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   ];
//   return applyDecorators(...decorators);
// };