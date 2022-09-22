import { ApiProperty } from '@nestjs/swagger';

export class Result<T> {
  @ApiProperty({ type: 'number', default: 200 })
  code: number;

  @ApiProperty({ type: 'string', default: 'ok' })
  message?: string;
  data?: T;
}
