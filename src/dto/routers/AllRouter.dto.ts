import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class AllRouterDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '路由id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'title' })
  title: string;

  @ApiProperty({ description: '子路由', isArray: true })
  children: AllRouterDto;
}