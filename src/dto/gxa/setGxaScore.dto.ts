import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { AllGxaWorkDto } from "./AllGxaWork.dto";

export class SetGxaScoreDto extends PickType(AllGxaWorkDto, [
  'id'
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '下标', minimum: 0, maximum: 13 })
  idx: number;

  @IsNotEmpty()
  @ApiProperty({ description: '成绩', minimum: 0, maximum: 5 })
  score: number;
}

export class SetGxaNetworkScoreDto extends PickType(AllGxaWorkDto, [
  'id'
]) {
  @IsNotEmpty()
  @ApiProperty({ description: '成绩', minimum: 0, maximum: 5 })
  score: number;
}