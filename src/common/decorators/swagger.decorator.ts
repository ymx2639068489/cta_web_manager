import {
  getSchemaPath,
  ApiExtraModels,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiErrRes,
  ApiOkRes,
  ApiPagerOkRes,
  EmptyModel,
  PagerDto,
} from '@/dto/api.dto';
import { API_CODES, API_MSGS } from '@/const/api.const';

/**
 * 成功
 */
export const SwaggerOk = <TModel extends Type<any>>(model?: TModel) => {
  const decorators = [
    ApiExtraModels(ApiOkRes),
    ApiExtraModels(model ?? EmptyModel),
    ApiResponse({
      description: API_MSGS[API_CODES.OK],
      status: API_CODES.OK,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiOkRes) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model ?? EmptyModel),
                default: null,
              },
            },
          },
        ],
      },
    }),
  ];

  return applyDecorators(...decorators);
};

/**
 * 分页成功
 */
export const SwaggerPagerOk = <TModel extends Type<any>>(model: TModel) => {
  const decorators = [
    ApiExtraModels(ApiPagerOkRes),
    ApiExtraModels(model),
    ApiResponse({
      description: API_MSGS[API_CODES.OK],
      status: API_CODES.OK,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiPagerOkRes) },
          {
            properties: {
              list: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  ];
  return applyDecorators(...decorators);
};

/**
 * 错误
 */
export const SwaggerErr = (code) => {
  const decorators = [
    ApiExtraModels(ApiErrRes),
    ApiResponse({
      description: `${API_MSGS[code]}`,
      status: code,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiErrRes) },
          {
            properties: {
              code: {
                default: code,
              },
              msg: {
                default: API_MSGS[code],
              },
              err: {
                default: null,
              },
            },
          },
        ],
      },
    }),
  ];
  return applyDecorators(...decorators);
};

/**
 * 分页入参
 */
export const SwaggerPagerBody = <TModel extends Type<any>>(model?: TModel) => {
  const decorators = [
    ApiExtraModels(PagerDto),
    ApiExtraModels(model ?? EmptyModel),
    ApiBody({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PagerDto) },
          { $ref: getSchemaPath(model ?? EmptyModel) },
        ],
      },
    }),
  ];
  return applyDecorators(...decorators);
};
