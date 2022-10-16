import { ApiProperty, IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AlgorithmIntegralDto } from './all.dto';

export class CreateIntegral extends PickType(AlgorithmIntegralDto, [
  'compititionName',
  'integral',
  'semester',
  'description',
]) {
  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
export class UpdateIntegral extends PickType(CreateIntegral, [
  'integral',
  'description',
]) {
  @ApiProperty({ description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
