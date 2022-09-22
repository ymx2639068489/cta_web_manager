import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+学号', example: '20101010110' })
  username: string;
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '+密码', example: '123456' })
  password: string;
}
