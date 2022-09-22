import { API_MSGS, API_CODES } from '@/const/api.const';
import { ApiErrRes, ApiOkRes, ApiPagerOkRes } from '@/dto/api.dto';

interface IPagerOkOpts {
  list: any[];
  page: number;
  limit: number;
  total: number;
}
type IErrArgs = [number, string?, Error?];

/**
 * 成功
 */
export class ApiOk implements ApiOkRes {
  code: number = API_CODES.OK;
  message: string = API_MSGS[API_CODES.OK];
  data: any;
  constructor(data: any = null) {
    this.data = data;
  }
}

/**
 * 分页成功
 */
export class ApiPagerOk implements ApiPagerOkRes {
  code: number = API_CODES.OK;
  message: string = API_MSGS[API_CODES.OK];
  list: any;
  page: number;
  limit: number;
  total: number;
  constructor({ list = [], page, limit: pageSize, total }: IPagerOkOpts) {
    // console.log(list);
    
    this.list = list;
    this.page = page;
    this.limit = pageSize;
    this.total = total;
  }
}

/**
 * 错误
 */
export class ApiErr implements ApiErrRes {
  code: number = API_CODES.UNKNOWN;
  message: string = API_MSGS[API_CODES.UNKNOWN];
  err?: string;

  constructor(...args: IErrArgs) {
    const [code, msg, err] = args;
    this.code = code;
    this.message = msg ?? API_MSGS[code];
    this.err = err ? err.toString() : undefined;
  }
}

/**
 * Api响应类
 */
export class Api {
  /**
   * 成功
   */
  static ok = (data?) => new ApiOk(data);

  /**
   * 分页成功
   */
  static pagerOk = (opts: IPagerOkOpts) => new ApiPagerOk(opts);

  /**
   * 错误
   */
  static err = (...args: IErrArgs) => new ApiErr(...args);
}
