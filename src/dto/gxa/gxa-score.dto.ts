import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class GxaScoreDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'id' })
  id: number;
  @IsArray()
  @ApiProperty({ description: '成绩列表', isArray: true })
  score: number;
}