import { SetMetadata } from '@nestjs/common'
enum Auth {
  jwt = 1,
  local = -1,
  none = 0,
}
export const NoAuth = (f = 1) => SetMetadata('no-auth', f);
