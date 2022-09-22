import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

class temp {
  iat?: any;
  exp?: any;
  // id
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id', example: '6' })
  id: number;
}
export class AuthUserDto extends PartialType(temp) {}
