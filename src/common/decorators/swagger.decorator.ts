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
const baseType = [
  'function Number()',
  'function String()',
  'function Boolean()'
]
export const SwaggerOk = <TModel extends Type<any>>(model?: TModel) => {
  const decorators = [
    ApiExtraModels(ApiOkRes),
    ApiExtraModels(model ?? EmptyModel),
  ];
  const _: any = {
    description: API_MSGS[API_CODES.OK],
    status: API_CODES.OK,
    schema: {
      allOf: [
        {
          properties: {
            code: {
              type: 'Number',
              description: '响应状态',
              default: 0,
            },
            message: {
              type: 'String',
              description: '消息',
              default: '成功',
            }
          },
        },
      ],
    },
  }
  if (!model) {
    decorators.push(ApiResponse(_))
    return applyDecorators(...decorators);
  }
  let flag = -1
  baseType.forEach((item, idx) => {
    if (model.toString().includes(item)) {
      flag = idx;
    }
  })
  switch (flag) {
    case -1: {
      _.schema.allOf = [
        { $ref: getSchemaPath(ApiOkRes) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(model),
              default: null,
            },
          },
        },
      ]
      decorators.push(ApiResponse(_))
      break
    }
    case 0: {
      _.schema.allOf[0].properties['data'] = {
        type: 'Number',
        description: '数据',
        default: 0
      }
      decorators.push(ApiResponse(_))
      break
    }
    case 1: {
      _.schema.allOf[0].properties['data'] = {
        type: 'String',
        description: '数据',
        default: 'This is the returned data'
      }
      decorators.push(ApiResponse(_))
      break
    }
    case 2: {
      _.schema.allOf[0].properties['data'] = {
        type: 'Boolean',
        description: '数据',
        default: true
      }
      decorators.push(ApiResponse(_))
      break
    }
  }
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
