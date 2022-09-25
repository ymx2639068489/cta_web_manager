import { API_CODES, API_MSGS } from '../const/api.const';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 基础响应类
 */
export class ApiBaseRes {
  @ApiProperty({ description: '状态码' })
  code: number;
  @ApiProperty({ description: '状态信息' })
  message: string;
}

/**
 * 基础Ok响应类
 */
export class ApiBaseOkRes extends ApiBaseRes {
  @ApiProperty({ default: API_CODES.OK })
  code: number;
  @ApiProperty({ default: API_MSGS[API_CODES.OK] })
  message: string;
}

/**
 * Ok响应类
 */
export class ApiOkRes<TData = any> extends ApiBaseOkRes {
  @ApiProperty({ description: '数据' })
  data: TData;
}

/**
 * Err响应类
 */
export class ApiErrRes extends ApiBaseRes {
  @ApiProperty({ description: '错误详细' })
  err?: string;
}

/**
 * 分页Ok响应类
 */
export class ApiPagerOkRes<TData = any> extends ApiBaseOkRes {
  @ApiProperty({ description: '总页数', default: 10 })
  total: number;
  @ApiProperty({ description: '分页列表' })
  list: TData[];
}

/**
 * 分页输入参数类
 */
export class PagerDto {
  @ApiProperty({ description: '分页页码', example: 1 })
  page: number;
  @ApiProperty({ description: '分页页大小', example: 10 })
  limit: number;
}

/**
 * 空模型类
 */
export class EmptyModel {}