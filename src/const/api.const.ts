export const API_CODES = {
  OK: 0,
  UNKNOWN: 99999,
  USER_EXIST: 40001,
  USER_NO_EXIST: 40002,
};

export const API_MSGS = {
  [API_CODES.OK]: '成功',
  [API_CODES.UNKNOWN]: '未知错误',
  [API_CODES.USER_EXIST]: '用户已存在',
  [API_CODES.USER_NO_EXIST]: '用户不存在',
};