import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { AllRouterDto } from "../routers";
export class RolesDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '权限名称' })
  roleName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '描述' })
  roleDescription: string;

  @ApiProperty({ description: '路由', isArray: true })
  routers: AllRouterDto;
}